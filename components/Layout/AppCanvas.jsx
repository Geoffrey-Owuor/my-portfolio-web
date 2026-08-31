// The app shell's scrolling surface. Everything except the header and the
// mobile drawer lives inside here, which means the *document* no longer
// scrolls — this element does. Anything that used to listen on `window`
// scroll or poke `document.documentElement` must go through the ref published
// by `useScrollContainer()`.
"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const ScrollContainerContext = createContext(null);

/** Ref object pointing at the element that actually scrolls the app. */
export const useScrollContainer = () => useContext(ScrollContainerContext);

/**
 * Owns the canvas ref. Has to sit *above* both the header and the canvas —
 * the header renders outside the canvas but still reads its scroll state, so
 * it can't be a descendant of <AppCanvas> itself.
 */
export const ScrollContainerProvider = ({ children }) => {
  const canvasRef = useRef(null);

  return (
    <ScrollContainerContext.Provider value={canvasRef}>
      {children}
    </ScrollContainerContext.Provider>
  );
};

const AppCanvas = ({ children }) => {
  const canvasRef = useScrollContainer();
  const pathname = usePathname();

  // Next's scroll restoration targets the window, which is now inert, so the
  // canvas would keep its old offset across navigations. Reset it ourselves —
  // except when there's a hash, where the browser's anchor scroll should win.
  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas || window.location.hash) return;

    canvas.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, canvasRef]);

  return (
    <div
      ref={canvasRef}
      id="app-canvas"
      // Insets come from --layout-top/--layout-inset (styles/globals.css) so
      // the shell and its `min-h-app` children share one geometry source.
      // `scrollbar-gutter: stable` keeps the gutter reserved, so locking the
      // scroll for a modal/drawer causes no reflow.
      // The column layout is what pins the footer: the canvas is always at
      // least viewport-tall, so a `flex-1` <main> soaks up any leftover space
      // and pushes <Footer> to the bottom on short pages, while tall pages
      // just scroll as before.
      className="border-border-subtle fixed top-(--layout-top) right-(--layout-inset) bottom-(--layout-inset) left-(--layout-inset) flex flex-col overflow-x-hidden overflow-y-auto scroll-smooth rounded-t-xl border [scrollbar-gutter:stable] lg:rounded-xl"
    >
      {children}
    </div>
  );
};

export default AppCanvas;
