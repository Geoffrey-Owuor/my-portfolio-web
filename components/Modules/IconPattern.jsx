import { useId } from "react";
import {
  Braces,
  CodeXml,
  Hash,
  Highlighter,
  Library,
  Send,
  Signature,
  Terminal,
  UserRound,
} from "lucide-react";

// Decorative tile of the blog form's own icons mixed with code icons, repeated
// with an SVG <pattern>. Icons draw in currentColor, so colour and opacity
// come from the className (theme tokens), and the radial mask fades the tile
// out towards the edges so it doesn't read as wallpaper. The mask keeps it
// solid well past a centred card, so it shows in the gutters around one.
// Place it inside a full-width `relative isolate` wrapper; it fills that
// wrapper and sits behind its content.
const TILE = 200;
const ICON = 22;

// Hand-placed (x, y, rotation) so the repeat doesn't look like a grid.
const ICONS = [
  [Highlighter, 14, 18, -12],
  [CodeXml, 88, 8, 8],
  [UserRound, 156, 30, -6],
  [Braces, 40, 82, 14],
  [Signature, 118, 74, -10],
  [Terminal, 172, 108, 6],
  [Library, 10, 146, 8],
  [Hash, 82, 150, -14],
  [Send, 148, 162, 10],
];

export default function IconPattern({
  className = "text-text-muted opacity-[0.12]",
}) {
  // useId output contains characters (":" / "«»") that aren't safe in url(#…).
  const id = `icon-pattern-${useId().replace(/[^\w-]/g, "")}`;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none absolute inset-0 -z-10 h-full w-full [mask-image:radial-gradient(ellipse_75%_70%_at_50%_40%,black_45%,transparent_100%)] ${className}`}
    >
      <defs>
        <pattern
          id={id}
          width={TILE}
          height={TILE}
          patternUnits="userSpaceOnUse"
        >
          {ICONS.map(([Icon, x, y, rotate], i) => (
            <g
              key={i}
              transform={`rotate(${rotate} ${x + ICON / 2} ${y + ICON / 2})`}
            >
              <Icon x={x} y={y} width={ICON} height={ICON} strokeWidth={1.5} />
            </g>
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
