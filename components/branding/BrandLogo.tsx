"use client";

import Link from "next/link";
import React from "react";

/*
  QX Profit brand logo — single source of truth.
  Vector artwork supplied by the brand (images/qs_logo.svg): isometric cube mark
  + "QX PROFIT" wordmark. All fills are currentColor so the colour follows text
  classes on the wrapper (defaults to white). Edit this file to change the logo
  on every surface (public, auth, in-app) in this app.
*/

type BrandLogoProps = {
  /** Rendered height in px. */
  size?: number;
  /** "full" = mark + wordmark, "mark" = cube only. */
  variant?: "full" | "mark";
  /** Wrap in a link. Pass null to render inline without a link. */
  href?: string | null;
  className?: string;
  /** Extra classes for the svg (e.g. a different text colour). */
  wordmarkClassName?: string;
};

const MARK_PATH =
  "M26.44 22.512v-15l-6.224-3.54v2.529l3.995 2.287v12.448l-1.765 1.011V12.135h-2.23v11.388l-1.813 1.012V9.294h-2.23V25.81l-1.813 1.035V3.178l4.043 2.312V2.937L13.233 0 8.087 2.937v2.528l4.043-2.287v23.668l-1.814-1.035V9.294h-2.23v15.265l-1.813-1.036V12.135h-2.23V22.27L2.23 21.236V8.788l.122-.072L6.273 6.5V3.949L0 7.512v15L13.233 30l13.208-7.488z";

// "QXPROFIT" wordmark glyphs from the supplied file, drawn in the 0..30 box.
const WORD_PATHS = [
  "m 49.3,20.26 c 0.98,-1.2 1.6,-3.2 1.6,-5.16 0,-2.14 -0.76,-4.2 -2.04,-5.5800003 -1.26,-1.36 -2.9,-2.02 -4.98,-2.02 -2.08,0 -3.72,0.66 -4.98,2.02 C 37.6,10.9 36.86,12.96 36.86,15.14 c 0,2.18 0.76,4.24 2.04,5.62 1.26,1.36 2.9,2.02 4.98,2.02 1.52,0 2.62,-0.3 3.78,-1 l 1.72,1.62 1.52,-1.62 z m -3.7,-3.5 -1.52,1.62 1.54,1.46 c -0.48,0.24 -1.12,0.38 -1.76,0.38 -2.4,0 -4,-2.02 -4,-5.08 0,-3.08 1.58,-5.08 4.02,-5.08 2.44,0 4.02,2 4.02,5.1 0,1.2 -0.22,2.28 -0.66,3.16 z",
  "m 60.089997,14.88 4.5,-7.1400003 h -3.48 l -2.68,4.8000003 -2.56,-4.8000003 h -3.56 l 4.44,7.2400003 -4.6,7.34 h 3.48 l 2.78,-5.06 2.8,5.06 h 3.56 z",
  "m 69.719993,17.12 h 3.74 c 2.68,0 4.4,-1.9 4.4,-4.86 0,-2.9200003 -1.66,-4.5200003 -4.7,-4.5200003 h -6.44 V 22.32 h 3 z m 0,-2.5 v -4.38 h 2.8 c 1.6,0 2.34,0.7 2.34,2.18 0,1.5 -0.74,2.2 -2.34,2.2 z",
  "m 82.910009,16.54 h 3.44 c 1.3,0 1.86,0.52 1.86,1.72 v 0.6 c -0.02,0.38 -0.02,0.74 -0.02,0.96 0,1.38 0.08,1.8 0.44,2.5 h 3.22 v -0.54 c -0.46,-0.26 -0.64,-0.56 -0.64,-1.2 -0.08,-4.3 -0.16,-4.5 -2.02,-5.3 1.64,-0.64 2.46,-1.82 2.46,-3.6 0,-1.16 -0.4,-2.2200003 -1.1,-2.9400003 -0.66,-0.68 -1.58,-1 -2.82,-1 h -7.82 V 22.32 h 3 z m 0,-2.5 v -3.8 h 3.62 c 0.86,0 1.2,0.08 1.58,0.38 0.36,0.3 0.54,0.8 0.54,1.48 0,0.7 -0.18,1.26 -0.54,1.56 -0.34,0.28 -0.72,0.38 -1.58,0.38 z",
  "m 100.5,7.4999997 c -2.039995,0 -3.719995,0.68 -4.959995,2.02 -1.3,1.4000003 -2.04,3.4400003 -2.04,5.6200003 0,2.18 0.74,4.24 2.04,5.62 1.26,1.36 2.9,2.02 4.979995,2.02 2.08,0 3.72,-0.66 4.98,-2.02 1.26,-1.34 2.04,-3.46 2.04,-5.52 0,-2.28 -0.74,-4.34 -2.04,-5.7200003 -1.28,-1.38 -2.88,-2.02 -5,-2.02 z M 100.52,10.06 c 2.46,0 4.02,2 4.02,5.16 0,3 -1.62,5 -4.02,5 -2.439995,0 -4.019995,-2 -4.019995,-5.08 0,-3.08 1.58,-5.08 4.019995,-5.08 z",
  "m 112.89,16.04 h 6.38 v -2.5 h -6.38 v -3.3 h 7.24 V 7.7399997 H 109.89 V 22.32 h 3 z",
  "m 125.04001,7.7399997 h -3 V 22.32 h 3 z",
  "m 134.14999,10.24 h 4.26 V 7.7399997 h -11.68 V 10.24 h 4.42 v 12.08 h 3 z",
];

const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 28,
  variant = "full",
  href = "/",
  className = "",
  wordmarkClassName = "",
}) => {
  const isMark = variant === "mark";
  const vbW = isMark ? 26.44 : 140;
  const width = (size * vbW) / 30;

  const content = (
    <span
      className={`inline-flex items-center text-white ${className}`}
      style={{ lineHeight: 1 }}
    >
      <svg
        width={width}
        height={size}
        viewBox={`0 0 ${vbW} 30`}
        fill="currentColor"
        role="img"
        aria-label="QX Profit"
        className={`shrink-0 ${wordmarkClassName}`}
      >
        <path d={MARK_PATH} />
        {!isMark && WORD_PATHS.map((d, i) => <path key={i} d={d} />)}
      </svg>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }
  return content;
};

export default BrandLogo;
