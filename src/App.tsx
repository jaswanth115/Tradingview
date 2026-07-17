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

  const handleToggleLock = useCallback(() => {
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

  return (
    <div className="app-shell" ref={focusTrapRef} tabIndex={-1}>
      <header className="topbar">
        <div className="topbar-brand">
          <span className="topbar-dot" aria-hidden="true" />
          <span>S&P 500 Desk</span>
        </div>
        <div className="topbar-symbol">
          {selectedSymbol ? (
            <>
              <span className="topbar-ticker">{selectedSymbol}</span>
              <span className="topbar-meta">NASDAQ · 1h</span>
            </>
          ) : (
            <span className="topbar-meta">Select a symbol</span>
          )}
        </div>
        <div className="topbar-actions">
          <button
            type="button"
            className={`topbar-lock${canEdit ? ' is-unlocked' : ''}`}
            onClick={handleToggleLock}
            title={
              canEdit
                ? 'Editing is unlocked — click to lock'
                : 'Read-only — click to unlock editing with your PIN'
            }
          >
            {canEdit ? 'Editing' : 'Read-only'}
          </button>
          <button
            type="button"
            className="mobile-watchlist-toggle"
            onClick={() => setMobileOpen(true)}
          >
            Watchlist
          </button>
        </div>
      </header>

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
        </div>

        <div className="desktop-watchlist">
          <WatchlistPanel
            activeList={activeList}
            counts={counts}
            symbols={symbols}
            selectedSymbol={selectedSymbol}
            query={query}
            canEdit={canEdit}
            onQueryChange={setQuery}
            onListChange={setActiveList}
            onSelectSymbol={selectSymbol}
            onMoveSymbol={move}
          />
        </div>
      </main>

      {mobileOpen ? (
        <div className="mobile-drawer-overlay" onClick={() => setMobileOpen(false)}>
          <div onClick={(event) => event.stopPropagation()}>
            <WatchlistPanel
              activeList={activeList}
              counts={counts}
              symbols={symbols}
              selectedSymbol={selectedSymbol}
              query={query}
              canEdit={canEdit}
              onQueryChange={setQuery}
              onListChange={setActiveList}
              onSelectSymbol={selectSymbol}
              onMoveSymbol={move}
              isMobileDrawer
              onCloseMobile={() => setMobileOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
