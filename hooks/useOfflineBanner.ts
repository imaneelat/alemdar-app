import { useEffect, useRef, useState } from "react";
import { useIsOnline } from "./useIsOnline";

const BACK_ONLINE_DISPLAY_MS = 2500;

export type OfflineBannerState = "offline" | "backOnline" | "hidden";

/**
 * Tracks the OfflineBanner's render state: red while offline, a transient
 * green "back online" state for a couple seconds after reconnecting, then
 * hidden. Shared so screens can know when the banner is occupying the top
 * inset (and skip applying their own).
 */
export function useOfflineBannerState(): OfflineBannerState {
  const isOnline = useIsOnline();
  const wasOffline = useRef(false);
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      wasOffline.current = true;
      setShowBackOnline(false);
      return;
    }
    if (!wasOffline.current) return;
    wasOffline.current = false;
    setShowBackOnline(true);
    const timeout = setTimeout(() => setShowBackOnline(false), BACK_ONLINE_DISPLAY_MS);
    return () => clearTimeout(timeout);
  }, [isOnline]);

  if (!isOnline) return "offline";
  if (showBackOnline) return "backOnline";
  return "hidden";
}

/** Whether the OfflineBanner is currently occupying the top inset. */
export function useOfflineBannerVisible(): boolean {
  return useOfflineBannerState() !== "hidden";
}
