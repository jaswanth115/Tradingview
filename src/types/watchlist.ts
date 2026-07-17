export const WATCHLIST_IDS = ['sp500', 'triggered', 'bought'] as const;

export type WatchlistId = (typeof WATCHLIST_IDS)[number];

export type WatchlistsState = Record<WatchlistId, string[]>;

export const WATCHLIST_META: Record<
  WatchlistId,
  { label: string; shortLabel: string; description: string }
> = {
  sp500: {
    label: 'All S&P 500',
    shortLabel: 'S&P 500',
    description: 'Full S&P 500 universe',
  },
  triggered: {
    label: 'Triggered',
    shortLabel: 'Triggered',
    description: 'Symbols that hit your triggers',
  },
  bought: {
    label: 'Bought',
    shortLabel: 'Bought',
    description: 'Positions you have bought',
  },
};

export const STORAGE_KEY = 'sp500-watchlists-v1';
