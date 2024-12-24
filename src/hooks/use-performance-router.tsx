import { useState, useEffect } from "react";
import { useRouter as useDefaultNextRouter } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import { db } from "@/database";

// Add type for deviceMemory without extending Navigator
declare global {
  interface Navigator {
    deviceMemory?: number;
    lol: string;
  }
}

// Utility to check if device is low-end
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

  // Memory check with fallback
  const hasLimitedMemory = navigator.deviceMemory
    ? navigator.deviceMemory <= 4
    : false;

  return hasLimitedMemory || hasLimitedCPU || isMobile;
};

export const useRouter = ({ fancy = false }: { fancy?: boolean } = {}) => {
  const [isLowEnd, setIsLowEnd] = useState<boolean>(false);
  const nextRouter = useDefaultNextRouter();
  const transitionRouter = useTransitionRouter();

  useEffect(() => {
    // Check device capabilities and set state
    // Wrap in try-catch in case of any browser API issues
    try {
      setIsLowEnd(isLowEndDevice());
    } catch (e) {
      // Default to low-end if there's any error
      setIsLowEnd(true);
    }
  }, []);

  // Return nextRouter immediately if animation is false
  if (!fancy) {
    return nextRouter;
  }

  // Return appropriate router based on device capabilities and animation enabled
  return isLowEnd ? nextRouter : transitionRouter;
};
