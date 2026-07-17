import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  filterSymbols,
  loadWatchlists,
  moveSymbol,
  saveWatchlists,
} from '../services/watchlistService';
import type { WatchlistId, WatchlistsState } from '../types/watchlist';

export function useWatchlists() {
  const [state, setState] = useState<WatchlistsState>(() => loadWatchlists());
  const [activeList, setActiveList] = useState<WatchlistId>('sp500');
  const [query, setQuery] = useState('');

  useEffect(() => {
    saveWatchlists(state);
  }, [state]);

  const move = useCallback((symbol: string, to: WatchlistId) => {
    setState((prev) => moveSymbol(prev, symbol, to));
  }, []);

  const symbols = useMemo(
    () => filterSymbols(state[activeList], query),
    [state, activeList, query],
  );

  const counts = useMemo(
    () => ({
      sp500: state.sp500.length,
      triggered: state.triggered.length,
      bought: state.bought.length,
    }),
    [state],
  );

  return {
    state,
    activeList,
    setActiveList,
    query,
    setQuery,
    symbols,
    counts,
    move,
  };
}
