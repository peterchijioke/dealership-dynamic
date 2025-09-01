import { useEffect, useRef } from "react";

type Handlers = {
  onEnter?: (entry: IntersectionObserverEntry) => void;
  onExit?: (entry: IntersectionObserverEntry) => void;
};

type AnyRef<T extends Element> =
  | React.RefObject<T | null>
  | React.MutableRefObject<T | null>;

export function useInView<T extends Element>(
  ref: AnyRef<T>,
  options: IntersectionObserverInit,
  { onEnter, onExit }: Handlers
) {
  const wasInView = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const io = new IntersectionObserver(([entry]) => {
      const inView = entry.isIntersecting;

      if (inView && !wasInView.current) onEnter?.(entry);
      if (!inView && wasInView.current) onExit?.(entry);

      wasInView.current = inView;
    }, options);

    io.observe(node);
    return () => io.disconnect();
  }, [ref, options.root, options.rootMargin, options.threshold, onEnter, onExit]);
}
