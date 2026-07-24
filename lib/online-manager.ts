import { onlineManager } from "@tanstack/react-query";
import { AppState, type AppStateStatus } from "react-native";
import { apiGet } from "./api-client";

const PROBE_INTERVAL_MS = 5000;
const PROBE_TIMEOUT_MS = 3000;

async function probe(): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
  try {
    await apiGet("/health", undefined, controller.signal, { noStore: true });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Wires react-query's onlineManager to a lightweight fetch probe against
 * /api/health instead of a native connectivity module, so queries pause
 * while offline/DB-down and resume automatically once reachable again.
 */
export function setupOnlineManager() {
  onlineManager.setEventListener((setOnline) => {
    let cancelled = false;

    const check = async () => {
      const online = await probe();
      if (!cancelled) setOnline(online);
    };

    void check();
    const interval = setInterval(check, PROBE_INTERVAL_MS);
    const subscription = AppState.addEventListener(
      "change",
      (state: AppStateStatus) => {
        if (state === "active") void check();
      },
    );

    return () => {
      cancelled = true;
      clearInterval(interval);
      subscription.remove();
    };
  });
}
