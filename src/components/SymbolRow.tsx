import { useEffect, useRef } from 'react';
import { WATCHLIST_IDS, WATCHLIST_META, type WatchlistId } from '../types/watchlist';

type SymbolRowProps = {
  symbol: string;
  currentList: WatchlistId;
  isSelected: boolean;
  canEdit: boolean;
  onSelect: (symbol: string) => void;
  onMove: (symbol: string, to: WatchlistId) => void;
};

export function SymbolRow({
  symbol,
  currentList,
  isSelected,
  canEdit,
  onSelect,
  onMove,
}: SymbolRowProps) {
  const rowRef = useRef<HTMLLIElement>(null);
  const destinations = WATCHLIST_IDS.filter((id) => id !== currentList);

  useEffect(() => {
    if (isSelected && rowRef.current) {
      rowRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [isSelected]);

  return (
    <li
      ref={rowRef}
      className={`symbol-row${isSelected ? ' is-selected' : ''}${
        canEdit ? '' : ' is-locked'
      }`}
    >
      <button
        type="button"
        className="symbol-main"
        onClick={() => onSelect(symbol)}
        aria-current={isSelected ? 'true' : undefined}
        title={`Show ${symbol} chart`}
      >
        <span className="symbol-ticker">{symbol}</span>
        <span className="symbol-hint">{isSelected ? 'Active' : 'Open'}</span>
      </button>

      {canEdit ? (
        <div className="symbol-actions" aria-label={`Move ${symbol}`}>
          {destinations.map((id) => (
            <button
              key={id}
              type="button"
              className={`symbol-move symbol-move--${id}`}
              onClick={() => onMove(symbol, id)}
              title={`Move to ${WATCHLIST_META[id].label}`}
            >
              {id === 'triggered' ? 'Trig' : id === 'bought' ? 'Buy' : 'S&P'}
            </button>
          ))}
        </div>
      ) : null}
    </li>
  );
}
