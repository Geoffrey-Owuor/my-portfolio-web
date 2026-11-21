import { useId } from "react";

// The site's mark, a copy of app/icon.svg (keep the two in step). The clip
// path id comes from useId because the navbar renders the mark twice (desktop
// bar and mobile header), and duplicate ids would collide.
const LogoMark = ({ className = "size-6" }) => {
  const clipId = useId();

  return (
    <svg
      viewBox="0 0 512 512"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="316" y="156" width="88" height="152" />
        </clipPath>
      </defs>
      <rect width="512" height="512" rx="116" fill="#030712" />
      <path
        d="M224 112H360V300A104 104 0 0 1 152 300"
        fill="none"
        stroke="#60a5fa"
        strokeWidth="88"
      />
      <g clipPath={`url(#${clipId})`} stroke="#030712" strokeWidth="14">
        <path d="M296 222L436 82M296 266L436 126M296 310L436 170M296 354L436 214M296 398L436 258M296 442L436 302" />
      </g>
    </svg>
  );
};

export default LogoMark;
