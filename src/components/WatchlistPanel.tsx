import { DeskSwitcher } from './DeskSwitcher';
import { WatchlistTabs } from './WatchlistTabs';
import { SymbolRow } from './SymbolRow';
import {
  BUCKET_META,
  DESK_META,
  type BucketId,
  type DeskId,
} from '../types/watchlist';

type WatchlistPanelProps = {
  activeDesk: DeskId;
  activeBucket: BucketId;
  deskCounts: Record<DeskId, number>;
  counts: Record<BucketId, number>;
  symbols: string[];
  selectedSymbol: string | null;
  query: string;
  canEdit: boolean;
  onDeskChange: (desk: DeskId) => void;
  onQueryChange: (value: string) => void;
  onBucketChange: (id: BucketId) => void;
  onSelectSymbol: (symbol: string) => void;
  onMoveSymbol: (symbol: string, to: BucketId) => void;
  onToggleEdit: () => void;
  onCloseMobile?: () => void;
  isMobileDrawer?: boolean;
};

export function WatchlistPanel({
  activeDesk,
  activeBucket,
  deskCounts,
  counts,
  symbols,
  selectedSymbol,
  query,
  canEdit,
  onDeskChange,
  onQueryChange,
  onBucketChange,
  onSelectSymbol,
  onMoveSymbol,
  onToggleEdit,
  onCloseMobile,
  isMobileDrawer = false,
}: WatchlistPanelProps) {
  const deskMeta = DESK_META[activeDesk];
  const bucketMeta = BUCKET_META[activeBucket];

  return (
    <aside className={`watchlist-panel${isMobileDrawer ? ' is-drawer' : ''}`}>
      <div className="watchlist-header">
        <div className="watchlist-heading">
          <p className="watchlist-eyebrow">Watchlist</p>
          <h1 className="watchlist-title">{deskMeta.shortLabel}</h1>
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

      <DeskSwitcher
        activeDesk={activeDesk}
        counts={deskCounts}
        onChange={onDeskChange}
      />

      <WatchlistTabs
        activeBucket={activeBucket}
        counts={counts}
        onChange={onBucketChange}
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

      <ul
        className="symbol-list"
        role="listbox"
        aria-label={`${deskMeta.label} · ${bucketMeta.label}`}
      >
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
              currentBucket={activeBucket}
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
