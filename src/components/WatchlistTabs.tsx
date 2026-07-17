import { WATCHLIST_IDS, WATCHLIST_META, type WatchlistId } from '../types/watchlist';

type WatchlistTabsProps = {
  activeList: WatchlistId;
  counts: Record<WatchlistId, number>;
  onChange: (id: WatchlistId) => void;
};

export function WatchlistTabs({ activeList, counts, onChange }: WatchlistTabsProps) {
  return (
    <div className="watchlist-tabs" role="tablist" aria-label="Watchlists">
      {WATCHLIST_IDS.map((id) => {
        const meta = WATCHLIST_META[id];
        const isActive = activeList === id;

        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`watchlist-tab${isActive ? ' is-active' : ''}`}
            onClick={() => onChange(id)}
          >
            <span className="watchlist-tab-label">{meta.shortLabel}</span>
            <span className="watchlist-tab-count">{counts[id]}</span>
          </button>
        );
      })}
    </div>
  );
}
