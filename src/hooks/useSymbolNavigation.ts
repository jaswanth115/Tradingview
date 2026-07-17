import { useCallback, useEffect, useRef, type RefObject } from 'react';

type UseSymbolNavigationArgs = {
  symbols: string[];
  selectedSymbol: string | null;
  onSelect: (symbol: string) => void;
  focusTrapRef: RefObject<HTMLElement | null>;
};

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  );
}

function blurChartIframes(): void {
  const iframes = document.querySelectorAll('iframe');
  for (const iframe of iframes) {
    if (document.activeElement === iframe) {
      iframe.blur();
    }
  }
}

export function useSymbolNavigation({
  symbols,
  selectedSymbol,
  onSelect,
  focusTrapRef,
}: UseSymbolNavigationArgs) {
  const symbolsRef = useRef(symbols);
  const selectedRef = useRef(selectedSymbol);

  useEffect(() => {
    symbolsRef.current = symbols;
  }, [symbols]);

  useEffect(() => {
    selectedRef.current = selectedSymbol;
  }, [selectedSymbol]);

  const reclaimKeyboardFocus = useCallback(() => {
    blurChartIframes();
    const trap = focusTrapRef.current;
    if (
      trap &&
      document.activeElement !== trap &&
      !isEditableTarget(document.activeElement)
    ) {
      trap.focus({ preventScroll: true });
    }
  }, [focusTrapRef]);

  const step = useCallback(
    (direction: 1 | -1) => {
      const list = symbolsRef.current;
      if (list.length === 0) return;

      const current = selectedRef.current;
      const currentIndex = current ? list.indexOf(current) : -1;
      let nextIndex: number;

      if (currentIndex === -1) {
        nextIndex = direction === 1 ? 0 : list.length - 1;
      } else {
        nextIndex = (currentIndex + direction + list.length) % list.length;
      }

      onSelect(list[nextIndex]);
    },
    [onSelect],
  );

  // TradingView chart runs in an iframe and steals focus on click.
  // Keep keyboard focus in the app so arrow/space navigation always works.
  useEffect(() => {
    reclaimKeyboardFocus();

    const onFocusIn = (event: FocusEvent) => {
      if (event.target instanceof HTMLIFrameElement) {
        window.setTimeout(reclaimKeyboardFocus, 0);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest('.chart-stage')) {
        window.setTimeout(reclaimKeyboardFocus, 0);
      }
    };

    const intervalId = window.setInterval(() => {
      if (document.activeElement instanceof HTMLIFrameElement) {
        reclaimKeyboardFocus();
      }
    }, 200);

    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('pointerdown', onPointerDown, true);

    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('pointerdown', onPointerDown, true);
      window.clearInterval(intervalId);
    };
  }, [reclaimKeyboardFocus]);

  useEffect(() => {
    const timer = window.setTimeout(reclaimKeyboardFocus, 50);
    return () => window.clearTimeout(timer);
  }, [selectedSymbol, reclaimKeyboardFocus]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;

      const isDown =
        event.key === 'ArrowDown' ||
        event.key === ' ' ||
        event.code === 'Space';
      const isUp = event.key === 'ArrowUp';

      if (!isDown && !isUp) return;

      event.preventDefault();
      event.stopPropagation();
      reclaimKeyboardFocus();
      step(isDown ? 1 : -1);
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [step, reclaimKeyboardFocus]);
}
