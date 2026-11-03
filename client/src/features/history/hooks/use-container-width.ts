import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { DEFAULT_CONTAINER_WIDTH } from '../lib/row-layout';

export function useContainerWidth(): [RefObject<HTMLDivElement | null>, number] {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(DEFAULT_CONTAINER_WIDTH);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.round(entry?.contentRect.width ?? DEFAULT_CONTAINER_WIDTH));
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return [containerRef, width];
}
