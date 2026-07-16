import { onlineManager } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";

/** Tracks the connectivity state driven by `setupOnlineManager()`. */
export function useIsOnline() {
  return useSyncExternalStore(
    onlineManager.subscribe.bind(onlineManager),
    onlineManager.isOnline.bind(onlineManager),
    () => true,
  );
}
