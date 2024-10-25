"use client";
import { useState, useEffect } from "react";
import NextLink from "next/link";
import { Link as TransitionLink } from "next-view-transitions";
import type { LinkProps as NextLinkProps } from "next/link";
import type { ComponentProps } from "react";

// Declare deviceMemory type
declare global {
  interface Navigator {
    deviceMemory?: number;
  }
}

// Combine props from both link types
type CommonLinkProps = NextLinkProps & ComponentProps<typeof TransitionLink>;

// Utility to check if device is low-end (reused from router hook)
const isLowEndDevice = (): boolean => {
  // Ensure we're in browser environment
  if (typeof window === "undefined") return true;

  // Check for mobile device
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

  // Use non-optional hardwareConcurrency (it's standard)
  const hasLimitedCPU = navigator.hardwareConcurrency <= 4;

  // Memory check with fallback`
  const hasLimitedMemory = navigator.deviceMemory
    ? navigator.deviceMemory <= 4
    : false;

  return hasLimitedMemory || hasLimitedCPU || isMobile;
};

export const Link = ({ children, ...props }: CommonLinkProps) => {
  const [isLowEnd, setIsLowEnd] = useState<boolean>(false);

  useEffect(() => {
    try {
      setIsLowEnd(isLowEndDevice());
    } catch (e) {
      // Default to low-end if there's any error
      setIsLowEnd(true);
    }
  }, []);

  // Initial render or SSR - use Next.js Link as fallback
  if (typeof window === "undefined" || !isLowEnd === undefined) {
    return <NextLink {...props}>{children}</NextLink>;
  }

  // Choose appropriate Link component based on device capability
  const LinkComponent = isLowEnd ? NextLink : TransitionLink;

  return <LinkComponent {...props}>{children}</LinkComponent>;
};

// Also export a hook to check device performance for other use cases
export const useIsLowEndDevice = () => {
  const [isLowEnd, setIsLowEnd] = useState<boolean>(false);

  useEffect(() => {
    try {
      setIsLowEnd(isLowEndDevice());
    } catch (e) {
      setIsLowEnd(true);
    }
  }, []);

  return isLowEnd;
};

export default Link;
