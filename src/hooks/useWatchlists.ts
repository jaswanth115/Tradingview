import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  filterSymbols,
  loadWatchlists,
  moveSymbol,
  saveWatchlists,
} from '../services/watchlistService';
import type {
  BucketId,
  DeskId,
  WatchlistsState,
} from '../types/watchlist';

export function useWatchlists() {
  const [state, setState] = useState<WatchlistsState>(() => loadWatchlists());
  const [activeDesk, setActiveDesk] = useState<DeskId>('sp500');
  const [activeBucket, setActiveBucket] = useState<BucketId>('universe');
  const [query, setQuery] = useState('');

  useEffect(() => {
    saveWatchlists(state);
  }, [state]);

  const setDesk = useCallback((desk: DeskId) => {
    setActiveDesk(desk);
    setActiveBucket('universe');
    setQuery('');
  }, []);

  const move = useCallback(
    (symbol: string, to: BucketId) => {
      setState((prev) => moveSymbol(prev, activeDesk, symbol, to));
    },
    [activeDesk],
  );

  const symbols = useMemo(
    () => filterSymbols(state[activeDesk][activeBucket], query),
    [state, activeDesk, activeBucket, query],
  );

  const counts = useMemo(
    () => ({
      universe: state[activeDesk].universe.length,
      triggered: state[activeDesk].triggered.length,
      bought: state[activeDesk].bought.length,
    }),
    [state, activeDesk],
  );

  const deskCounts = useMemo(
    () => ({
      sp500:
        state.sp500.universe.length +
        state.sp500.triggered.length +
        state.sp500.bought.length,
      ftmo:
        state.ftmo.universe.length +
        state.ftmo.triggered.length +
        state.ftmo.bought.length,
    }),
    [state],
  );

  return {
    state,
    activeDesk,
    setActiveDesk: setDesk,
    activeBucket,
    setActiveBucket,
    query,
    setQuery,
    symbols,
    counts,
    deskCounts,
    move,
  };
}
