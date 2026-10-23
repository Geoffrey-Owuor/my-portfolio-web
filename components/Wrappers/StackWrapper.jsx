"use client";
import Image from "next/image";
import { Layers2, Loader2, MessageCircleCode } from "lucide-react";
import SectionTitle from "./SectionTitle";
import EmptyState from "../Modules/EmptyState";
import ScrollReveal from "../Modules/ScrollReveal";

// Icons we want to invert their colors in dark mode
const iconsToInvert = [
  "awsLogo",
  "githubLogo",
  "nextjsLogo",
  "prismaLogo",
  "vercelLogo",
];

const StackWrapper = ({ toolNames, toolIcons }) => {
  return (
    <div className="mx-1 w-full max-w-7xl min-w-0 flex-1 md:mx-auto">
      {/* Section Title  */}
      <SectionTitle
        sectionId="stack"
        title="My Tech Stack"
        subtitle="Tools & tech I work with"
        alertMessage="Innovating with cutting-edge tools and frameworks"
        alertIcon={MessageCircleCode}
      />

      <ScrollReveal>
        {/* --- Core Technologies: dominant scrolling marquee --- */}
        <div className="bg-surface border-border-subtle w-full overflow-hidden rounded-xl border py-8">
          {toolIcons.length > 0 && (
            <div className="motion-safe:mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:px-6">
              <div className="motion-safe:animate-marquee flex items-center gap-10 motion-safe:w-max motion-safe:hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center">
                {toolIcons.map(([name, iconSrc]) => (
                  <div
                    key={name}
                    title={name.replace(/Logo$/, "")}
                    className="flex shrink-0 flex-col items-center justify-center"
                  >
                    <Image
                      src={iconSrc}
                      alt={name}
                      width={40}
                      height={40}
                      className={`h-10 w-10 object-contain grayscale-35 transition-all duration-150 hover:grayscale-0 ${iconsToInvert.includes(name) ? "dark:invert" : ""}`}
                    />
                  </div>
                ))}
                {/* Duplicate set for a seamless loop — hidden from assistive tech and reduced-motion users */}
                {toolIcons.map(([name, iconSrc]) => (
                  <div
                    key={`${name}-dup`}
                    aria-hidden="true"
                    className="flex shrink-0 flex-col items-center justify-center motion-reduce:hidden"
                  >
                    <Image
                      src={iconSrc}
                      alt=""
                      width={40}
                      height={40}
                      className={`h-10 w-10 object-contain grayscale-35 transition-all duration-150 hover:grayscale-0 ${iconsToInvert.includes(name) ? "dark:invert" : ""}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {toolIcons.length === 0 && (
            <div className="flex items-center justify-center gap-4 px-5 py-10">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-text-muted text-sm">
                Waiting for connection...
              </span>
            </div>
          )}
        </div>

        {/* --- Other Tools & Skills: quiet, additive strip --- */}
        <div className="mt-8 flex w-full flex-col items-center gap-3 sm:flex-row sm:items-start">
          <span className="text-text-muted flex shrink-0 items-center gap-1.5 pt-0.5 text-sm">
            <Layers2 className="h-3.5 w-3.5" />
            Also using
          </span>

          {toolNames?.length > 0 && (
            // `w-full min-w-0` is load-bearing: as a flex item this div would
            // otherwise size to max-content (flex items default to
            // `min-width: auto`, and `items-center` stops it from stretching),
            // so the pills laid out one long row that overflowed and clipped on
            // both sides instead of wrapping.
            <div className="flex w-full min-w-0 flex-wrap justify-center gap-2 sm:justify-start">
              {toolNames.map((tool) => (
                <span
                  key={tool.id}
                  className="border-border-subtle text-text-muted rounded-lg border px-3 py-1 text-sm"
                >
                  {tool.tool_name}
                </span>
              ))}
            </div>
          )}

          {!toolNames?.length && (
            <EmptyState
              command="ls ~/stack --other"
              failed={!toolNames}
              emptyMessage="None listed yet."
              compact
            />
          )}
        </div>
      </ScrollReveal>
    </div>
  );
};

export default StackWrapper;
