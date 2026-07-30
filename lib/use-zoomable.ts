import { useEffect, useRef } from "react";

const ZOOM_CONFIG = {
  initialZoom: 3,
  minZoom: 1.25,
  maxZoom: 4,
  zoomSpeed: 0.01,
} as const;

/**
 * Hover/touch zoom for product gallery (parity with public/home-page/script/product-img.js).
 */
export function useZoomable(activeSrc: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{
    zoomed: boolean;
    zoom: number;
    initialZoom: number;
  }>({
    zoomed: false,
    zoom: ZOOM_CONFIG.initialZoom,
    initialZoom: ZOOM_CONFIG.initialZoom,
  });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const img = element.querySelector<HTMLImageElement>(".zoomable__img");
    if (!img) {
      return;
    }

    img.draggable = false;

    const initialZoom = Math.max(
      Math.min(ZOOM_CONFIG.initialZoom, ZOOM_CONFIG.maxZoom),
      ZOOM_CONFIG.minZoom,
    );

    stateRef.current = {
      zoomed: false,
      zoom: initialZoom,
      initialZoom,
    };

    element.classList.remove("zoomable--zoomed");
    element.style.setProperty("--zoom", String(initialZoom));
    element.style.removeProperty("--zoom-pos-x");
    element.style.removeProperty("--zoom-pos-y");

    const handleMouseover = () => {
      if (stateRef.current.zoomed) {
        return;
      }

      element.classList.add("zoomable--zoomed");
      stateRef.current.zoomed = true;
    };

    const handleMousemove = (evt: MouseEvent) => {
      if (!stateRef.current.zoomed) {
        return;
      }

      const elPos = element.getBoundingClientRect();
      const percentageX = `${((evt.clientX - elPos.left) * 100) / elPos.width}%`;
      const percentageY = `${((evt.clientY - elPos.top) * 100) / elPos.height}%`;

      element.style.setProperty("--zoom-pos-x", percentageX);
      element.style.setProperty("--zoom-pos-y", percentageY);
    };

    const handleMouseout = () => {
      if (!stateRef.current.zoomed) {
        return;
      }

      element.style.setProperty("--zoom", String(stateRef.current.initialZoom));
      element.classList.remove("zoomable--zoomed");
      stateRef.current.zoomed = false;
    };

    const handleWheel = (evt: WheelEvent) => {
      if (!stateRef.current.zoomed) {
        return;
      }

      evt.preventDefault();

      const newZoom =
        stateRef.current.zoom + evt.deltaY * (ZOOM_CONFIG.zoomSpeed * -1);

      stateRef.current.zoom = Math.max(
        Math.min(newZoom, ZOOM_CONFIG.maxZoom),
        ZOOM_CONFIG.minZoom,
      );
      element.style.setProperty("--zoom", String(stateRef.current.zoom));
    };

    const handleTouchstart = (evt: TouchEvent) => {
      evt.preventDefault();
      handleMouseover();
    };

    const handleTouchmove = (evt: TouchEvent) => {
      if (!stateRef.current.zoomed || !evt.touches[0]) {
        return;
      }

      const elPos = element.getBoundingClientRect();

      let percentageX =
        ((evt.touches[0].clientX - elPos.left) * 100) / elPos.width;
      let percentageY =
        ((evt.touches[0].clientY - elPos.top) * 100) / elPos.height;

      percentageX = Math.max(Math.min(percentageX, 100), 0);
      percentageY = Math.max(Math.min(percentageY, 100), 0);

      element.style.setProperty("--zoom-pos-x", `${percentageX}%`);
      element.style.setProperty("--zoom-pos-y", `${percentageY}%`);
    };

    const handleTouchend = () => {
      handleMouseout();
    };

    element.addEventListener("mouseover", handleMouseover);
    element.addEventListener("mousemove", handleMousemove);
    element.addEventListener("mouseout", handleMouseout);
    element.addEventListener("wheel", handleWheel, { passive: false });
    element.addEventListener("touchstart", handleTouchstart, { passive: false });
    element.addEventListener("touchmove", handleTouchmove, { passive: false });
    element.addEventListener("touchend", handleTouchend);

    return () => {
      element.removeEventListener("mouseover", handleMouseover);
      element.removeEventListener("mousemove", handleMousemove);
      element.removeEventListener("mouseout", handleMouseout);
      element.removeEventListener("wheel", handleWheel);
      element.removeEventListener("touchstart", handleTouchstart);
      element.removeEventListener("touchmove", handleTouchmove);
      element.removeEventListener("touchend", handleTouchend);
      element.classList.remove("zoomable--zoomed");
    };
  }, [activeSrc]);

  return containerRef;
}
