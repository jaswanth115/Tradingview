import { WatchlistTabs } from './WatchlistTabs';
import { SymbolRow } from './SymbolRow';
import { WATCHLIST_META, type WatchlistId } from '../types/watchlist';

type WatchlistPanelProps = {
  activeList: WatchlistId;
  counts: Record<WatchlistId, number>;
  symbols: string[];
  selectedSymbol: string | null;
  query: string;
  canEdit: boolean;
  onQueryChange: (value: string) => void;
  onListChange: (id: WatchlistId) => void;
  onSelectSymbol: (symbol: string) => void;
  onMoveSymbol: (symbol: string, to: WatchlistId) => void;
  onToggleEdit: () => void;
  onCloseMobile?: () => void;
  isMobileDrawer?: boolean;
};

export function WatchlistPanel({
  activeList,
  counts,
  symbols,
  selectedSymbol,
  query,
  canEdit,
  onQueryChange,
  onListChange,
  onSelectSymbol,
  onMoveSymbol,
  onToggleEdit,
  onCloseMobile,
  isMobileDrawer = false,
}: WatchlistPanelProps) {
  const meta = WATCHLIST_META[activeList];

  return (
    <aside className={`watchlist-panel${isMobileDrawer ? ' is-drawer' : ''}`}>
      <div className="watchlist-header">
        <div className="watchlist-heading">
          <p className="watchlist-eyebrow">Watchlist</p>
          <h1 className="watchlist-title">{meta.shortLabel}</h1>
        </div>
        <div className="watchlist-header-actions">
          <button
            type="button"
            className={`watchlist-lock${canEdit ? ' is-unlocked' : ''}`}
            onClick={onToggleEdit}
            title={
              canEdit
                ? 'Editing unlocked — click to lock'
                : 'Read-only — click to unlock with PIN'
            }
          >
            {canEdit ? 'Editing' : 'Read-only'}
          </button>
          {isMobileDrawer && onCloseMobile ? (
            <button
              type="button"
              className="watchlist-drawer-close"
              onClick={onCloseMobile}
              aria-label="Close watchlist"
            >
              Close
            </button>
          ) : null}
        </div>
      </div>

      <WatchlistTabs
        activeList={activeList}
        counts={counts}
        onChange={onListChange}
      />

      <label className="watchlist-search">
        <span className="sr-only">Search symbols</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search ticker…"
          autoComplete="off"
          spellCheck={false}
        />
      </label>

      <div className="watchlist-columns" aria-hidden="true">
        <span>Symbol</span>
        <span>{canEdit ? 'Move' : ''}</span>
      </div>

      <ul className="symbol-list" role="listbox" aria-label={meta.label}>
        {symbols.length === 0 ? (
          <li className="symbol-empty">
            {query.trim()
              ? 'No symbols match your search.'
              : 'This watchlist is empty. Move a symbol here from another list.'}
          </li>
        ) : (
          symbols.map((symbol) => (
            <SymbolRow
              key={symbol}
              symbol={symbol}
              currentList={activeList}
              isSelected={symbol === selectedSymbol}
              canEdit={canEdit}
              onSelect={onSelectSymbol}
              onMove={onMoveSymbol}
            />
          ))
        )}
      </ul>

      <p className="watchlist-hint">
        {canEdit
          ? 'Use arrow keys or space to change chart symbol'
          : 'Use arrow keys or space to change chart symbol · read-only'}
      </p>
    </aside>
  );
}
