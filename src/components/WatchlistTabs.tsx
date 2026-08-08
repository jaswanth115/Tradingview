import { BUCKET_IDS, BUCKET_META, type BucketId } from '../types/watchlist';

type WatchlistTabsProps = {
  activeBucket: BucketId;
  counts: Record<BucketId, number>;
  onChange: (id: BucketId) => void;
};

export function WatchlistTabs({
  activeBucket,
  counts,
  onChange,
}: WatchlistTabsProps) {
  return (
    <div className="watchlist-tabs" role="tablist" aria-label="Watchlists">
      {BUCKET_IDS.map((id) => {
        const meta = BUCKET_META[id];
        const isActive = activeBucket === id;

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
