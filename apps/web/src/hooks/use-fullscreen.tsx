import { useState } from "react";
import { cn } from "@/lib/utils";

export function useFullscreen(initialState = true) {
  const [isFullscreen, setIsFullscreen] = useState(initialState);

  const toggle = () => setIsFullscreen((prev) => !prev);

  const fullscreenClasses = cn(
    "rounded-xl max-h-[80vh] overflow-scroll transition-all duration-200",
    isFullscreen && "min-w-[90vw] h-[90vh] max-h-screen"
  );

  return {
    isFullscreen,
    toggle,
    fullscreenClasses
  };
}