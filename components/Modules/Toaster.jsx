"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

// The app's one notification system. Mounted once in app/layout.js; any
// client component calls `useToast()`:
//
//   const toast = useToast();
//   toast.success("Blog published");
//   toast.error(message, { title: "Couldn't save" });
//   toast.info("…", { id: "network", duration: Infinity, icon: WifiOff });
//
// Showing a toast with an `id` that's already on screen replaces it in place
// (no duplicate stacking — e.g. offline → back online, or an effect that
// runs twice under Strict Mode). Field errors belong inline next to their
// form, not here.

const MAX_VISIBLE = 3;
const DURATION = { success: 5000, info: 5000, error: 8000 };

const TYPES = {
  success: { icon: CheckCircle2, iconClass: "text-success", bar: "bg-success" },
  error: { icon: AlertCircle, iconClass: "text-danger", bar: "bg-danger" },
  info: { icon: Info, iconClass: "text-accent", bar: "bg-accent" },
};

const ToastContext = createContext(null);

export const useToast = () => {
  const toast = useContext(ToastContext);
  if (!toast) throw new Error("useToast() must be used inside <ToastProvider>");
  return toast;
};

let nextId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(({ type = "info", id, ...rest }) => {
    const toastId = id ?? `toast-${++nextId}`;
    const toast = {
      type,
      duration: DURATION[type] ?? DURATION.info,
      ...rest,
      id: toastId,
      // A fresh key restarts the countdown when an id is replaced in place.
      version: ++nextId,
    };

    setToasts((current) => {
      const index = current.findIndex((t) => t.id === toastId);
      if (index !== -1) {
        const next = [...current];
        next[index] = toast;
        return next;
      }
      // Oldest drop off once the stack is full.
      return [...current, toast].slice(-MAX_VISIBLE);
    });

    return toastId;
  }, []);

  const api = useMemo(() => {
    const typed = (type) => (message, options) =>
      show({ ...options, type, message });
    return {
      show,
      dismiss,
      success: typed("success"),
      error: typed("error"),
      info: typed("info"),
    };
  }, [show, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

/**
 * Bottom-right stack on desktop; on mobile, full width inside the page gutter
 * and clear of the home indicator. Newest sits at the bottom, nearest the
 * edge it slides in from. Always mounted, so its live region is registered
 * before the first toast arrives and gets announced.
 */
const ToastViewport = ({ toasts, onDismiss }) => (
  <section
    aria-label="Notifications"
    className="z-toast pointer-events-none fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[22rem]"
  >
    <ol aria-live="polite" className="flex flex-col gap-2">
      <AnimatePresence initial={false} custom={0}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onDismiss={() => onDismiss(toast.id)}
          />
        ))}
      </AnimatePresence>
    </ol>
  </section>
);

// Exit follows a swipe when there was one, otherwise sinks back down.
const toastVariants = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, x: 0, scale: 1 },
  exit: (swipe) =>
    swipe
      ? { opacity: 0, x: swipe * 360, transition: { duration: 0.2 } }
      : { opacity: 0, y: 12, scale: 0.98, transition: { duration: 0.18 } },
};
const reducedVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const SWIPE_DISTANCE = 90;
const SWIPE_VELOCITY = 500;

const Toast = ({ toast, onDismiss }) => {
  const { type, title, message, duration, version } = toast;
  const { icon: TypeIcon, iconClass, bar } = TYPES[type] ?? TYPES.info;
  const Icon = toast.icon ?? TypeIcon;
  const prefersReducedMotion = useReducedMotion();
  const timed = Number.isFinite(duration);

  // The countdown pauses while the toast is hovered or holds focus, so a
  // long message can't vanish mid-read. The CSS bar pauses with it.
  const [paused, setPaused] = useState(false);
  const [swipe, setSwipe] = useState(0);
  const remaining = useRef(duration);
  const startedAt = useRef(0);

  useEffect(() => {
    remaining.current = duration;
  }, [duration, version]);

  useEffect(() => {
    if (!timed || paused) return;
    startedAt.current = Date.now();
    const timer = setTimeout(onDismiss, remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [timed, paused, version, onDismiss]);

  const handleDragEnd = (_, { offset, velocity }) => {
    if (
      Math.abs(offset.x) > SWIPE_DISTANCE ||
      Math.abs(velocity.x) > SWIPE_VELOCITY
    ) {
      setSwipe(Math.sign(offset.x) || 1);
      onDismiss();
    }
  };

  return (
    <motion.li
      layout={!prefersReducedMotion}
      custom={swipe}
      variants={prefersReducedMotion ? reducedVariants : toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
      drag={prefersReducedMotion ? false : "x"}
      dragSnapToOrigin
      dragElastic={0.6}
      onDragEnd={handleDragEnd}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role={type === "error" ? "alert" : "status"}
      aria-atomic="true"
      className="border-border-subtle bg-surface dark:bg-surface-raised rounded-card pointer-events-auto relative touch-pan-y overflow-hidden border shadow-lg shadow-black/5 select-none dark:shadow-black/40"
    >
      <div className="flex items-start gap-3 py-3 pr-2 pl-4">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconClass}`} />

        <div className="min-w-0 flex-1 py-px">
          {title && (
            <p className="text-text-primary text-sm font-semibold">{title}</p>
          )}
          <p
            className={`text-sm leading-snug wrap-break-word ${
              title ? "text-text-muted mt-0.5" : "text-text-primary"
            }`}
          >
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="text-text-muted hover:text-text-primary hover:bg-surface-raised dark:hover:bg-surface rounded-control -my-0.5 flex size-7 shrink-0 cursor-pointer items-center justify-center transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {timed && (
        <span
          key={version}
          aria-hidden="true"
          style={{
            animationDuration: `${duration}ms`,
            animationPlayState: paused ? "paused" : "running",
          }}
          className={`animate-toast-countdown absolute inset-x-0 bottom-0 h-0.5 origin-left opacity-60 ${bar}`}
        />
      )}
    </motion.li>
  );
};
