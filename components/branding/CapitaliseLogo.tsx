/* Brand logo — thin wrapper kept for existing imports.
   All rendering lives in the single source of truth: components/branding/BrandLogo. */
"use client";

import React from "react";
import BrandLogo from "@/components/branding/BrandLogo";

type Variant = "icon" | "wordmark" | "full";

export interface CapitaliseLogoProps {
  variant?: Variant;
  size?: number;
  color?: string;
  className?: string;
  wordmarkClassName?: string;
  iconClassName?: string;
  gradient?: boolean;
  ariaLabel?: string;
}

const CapitaliseLogo: React.FC<CapitaliseLogoProps> = ({
  variant = "full",
  size = 28,
  className = "",
  wordmarkClassName = "",
}) => (
  <BrandLogo
    size={size}
    variant={variant === "icon" ? "mark" : "full"}
    href={null}
    className={className}
    wordmarkClassName={wordmarkClassName}
  />
);

export default CapitaliseLogo;
