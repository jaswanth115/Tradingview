import { DESK_META, type DeskId } from '../types/watchlist';

type DeskSwitcherProps = {
  activeDesk: DeskId;
  counts: Record<DeskId, number>;
  onChange: (desk: DeskId) => void;
};

export function DeskSwitcher({ activeDesk, counts, onChange }: DeskSwitcherProps) {
  return (
    <div className="desk-switcher" role="tablist" aria-label="Trading desks">
      {(['sp500', 'ftmo'] as const).map((desk) => {
        const meta = DESK_META[desk];
        const isActive = activeDesk === desk;

        return (
          <button
            key={desk}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`desk-tab${isActive ? ' is-active' : ''}`}
            onClick={() => onChange(desk)}
          >
            <span className="desk-tab-label">{meta.shortLabel}</span>
            <span className="desk-tab-count">{counts[desk]}</span>
          </button>
        );
      })}
    </div>
  );
}
