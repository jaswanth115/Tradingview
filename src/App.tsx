import { useCallback, useEffect, useRef, useState } from 'react';
import { TradingViewChart } from './components/TradingViewChart';
import { WatchlistPanel } from './components/WatchlistPanel';
import { useSymbolNavigation } from './hooks/useSymbolNavigation';
import { useWatchlists } from './hooks/useWatchlists';
import { useEditMode } from './hooks/useEditMode';

export default function App() {
  const {
    activeList,
    setActiveList,
    query,
    setQuery,
    symbols,
    counts,
    move,
  } = useWatchlists();

  const { canEdit, unlock, lock } = useEditMode();

  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const focusTrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (symbols.length === 0) {
      setSelectedSymbol(null);
      return;
    }

    setSelectedSymbol((current) =>
      current && symbols.includes(current) ? current : symbols[0],
    );
  }, [symbols]);

  const selectSymbol = useCallback((symbol: string) => {
    setSelectedSymbol(symbol);
    setMobileOpen(false);
  }, []);

  const handleToggleEdit = useCallback(() => {
    if (canEdit) {
      lock();
      return;
    }

    const pin = window.prompt('Enter PIN to enable editing:');
    if (pin === null) return;
    if (!unlock(pin.trim())) {
      window.alert('Incorrect PIN. Editing stays locked.');
    }
  }, [canEdit, lock, unlock]);

  useSymbolNavigation({
    symbols,
    selectedSymbol,
    onSelect: selectSymbol,
    focusTrapRef,
  });

  const watchlistProps = {
    activeList,
    counts,
    symbols,
    selectedSymbol,
    query,
    canEdit,
    onQueryChange: setQuery,
    onListChange: setActiveList,
    onSelectSymbol: selectSymbol,
    onMoveSymbol: move,
    onToggleEdit: handleToggleEdit,
  };

  return (
    <div className="app-shell" ref={focusTrapRef} tabIndex={-1}>
      <main className="workspace">
        <div className="chart-stage">
          {selectedSymbol ? (
            <TradingViewChart key={selectedSymbol} symbol={selectedSymbol} />
          ) : (
            <div className="chart-empty">
              <p>No symbols in this watchlist.</p>
              <p>Switch lists or move a ticker here to open a chart.</p>
            </div>
          )}

          <button
            type="button"
            className="mobile-watchlist-fab"
            onClick={() => setMobileOpen(true)}
            aria-label="Open watchlist"
          >
            Watchlist
          </button>
        </div>

        <div className="desktop-watchlist">
          <WatchlistPanel {...watchlistProps} />
        </div>
      </main>

      {mobileOpen ? (
        <div className="mobile-drawer-overlay" onClick={() => setMobileOpen(false)}>
          <div onClick={(event) => event.stopPropagation()}>
            <WatchlistPanel
              {...watchlistProps}
              isMobileDrawer
              onCloseMobile={() => setMobileOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
