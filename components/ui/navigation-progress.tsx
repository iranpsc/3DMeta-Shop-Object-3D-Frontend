"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

const BAR_COLOR = "#2667ff";

type ProgressState = {
  active: boolean;
  progress: number;
};

function urlsDiffer(nextUrl: string, currentUrl: string): boolean {
  try {
    const next = new URL(nextUrl, currentUrl);
    const current = new URL(currentUrl);

    return next.pathname !== current.pathname || next.search !== current.search;
  } catch {
    return true;
  }
}

function shouldStartFromAnchor(event: MouseEvent, anchor: HTMLAnchorElement): boolean {
  if (event.defaultPrevented || event.button !== 0) {
    return false;
  }

  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return false;
  }

  if (anchor.target && anchor.target !== "_self") {
    return false;
  }

  if (anchor.hasAttribute("download")) {
    return false;
  }

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("javascript:")) {
    return false;
  }

  if (href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  return urlsDiffer(href, window.location.href);
}

function NavigationProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;

  const [state, setState] = useState<ProgressState>({ active: false, progress: 0 });
  const navigatingRef = useRef(false);
  const tickRef = useRef<number | null>(null);
  const completeTimerRef = useRef<number | null>(null);
  const initialRouteRef = useRef(true);

  const clearTimers = useCallback(() => {
    if (tickRef.current !== null) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }

    if (completeTimerRef.current !== null) {
      window.clearTimeout(completeTimerRef.current);
      completeTimerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clearTimers();
    navigatingRef.current = true;

    queueMicrotask(() => {
      if (!navigatingRef.current) {
        return;
      }

      setState({ active: true, progress: 8 });

      tickRef.current = window.setInterval(() => {
        setState((current) => {
          if (!current.active) {
            return current;
          }

          const increment =
            current.progress >= 90 ? 0 : current.progress >= 70 ? 0.6 : current.progress >= 40 ? 2 : 6;

          return {
            active: true,
            progress: Math.min(current.progress + increment, 94),
          };
        });
      }, 180);
    });
  }, [clearTimers]);

  const complete = useCallback(() => {
    if (!navigatingRef.current) {
      return;
    }

    clearTimers();
    navigatingRef.current = false;
    setState({ active: true, progress: 100 });

    completeTimerRef.current = window.setTimeout(() => {
      setState({ active: false, progress: 0 });
    }, 280);
  }, [clearTimers]);

  useEffect(() => {
    if (initialRouteRef.current) {
      initialRouteRef.current = false;
      return;
    }

    complete();
  }, [routeKey, complete]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const anchor = (event.target as Element | null)?.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      if (shouldStartFromAnchor(event, anchor)) {
        start();
      }
    }

    function handlePopState() {
      start();
    }

    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", handlePopState);

    const originalPushState = history.pushState.bind(history);
    const originalReplaceState = history.replaceState.bind(history);

    history.pushState = (...args) => {
      const url = args[2];
      if (typeof url === "string" && urlsDiffer(url, window.location.href)) {
        start();
      }

      return originalPushState(...args);
    };

    history.replaceState = (...args) => {
      const url = args[2];
      if (typeof url === "string" && urlsDiffer(url, window.location.href)) {
        start();
      }

      return originalReplaceState(...args);
    };

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", handlePopState);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      clearTimers();
    };
  }, [clearTimers, start]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-0 z-[10001] h-[3px] transition-opacity duration-200 motion-reduce:hidden ${
        state.active ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="relative h-full transition-[width] duration-200 ease-out"
        style={{
          width: `${state.progress}%`,
          backgroundColor: BAR_COLOR,
          boxShadow: `0 0 10px ${BAR_COLOR}, 0 0 4px ${BAR_COLOR}`,
        }}
      >
        <span
          className="absolute top-0 block h-full w-24 -translate-y-1/2 opacity-40 blur-md"
          style={{
            insetInlineEnd: 0,
            backgroundColor: BAR_COLOR,
          }}
        />
      </div>
    </div>
  );
}

export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressBarInner />
    </Suspense>
  );
}
