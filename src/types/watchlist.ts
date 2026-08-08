export const DESK_IDS = ['sp500', 'ftmo'] as const;
export const BUCKET_IDS = ['universe', 'triggered', 'bought'] as const;

export type DeskId = (typeof DESK_IDS)[number];
export type BucketId = (typeof BUCKET_IDS)[number];

export type DeskState = Record<BucketId, string[]>;
export type WatchlistsState = Record<DeskId, DeskState>;

export const DESK_META: Record<
  DeskId,
  { label: string; shortLabel: string; description: string }
> = {
  sp500: {
    label: 'S&P 500',
    shortLabel: 'S&P 500',
    description: 'S&P 500 trading desk',
  },
  ftmo: {
    label: 'FTMO',
    shortLabel: 'FTMO',
    description: 'FTMO trading desk',
  },
};

export const BUCKET_META: Record<
  BucketId,
  { label: string; shortLabel: string; description: string }
> = {
  universe: {
    label: 'All Symbols',
    shortLabel: 'All',
    description: 'Full desk universe',
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

export const STORAGE_KEY = 'sp500-watchlists-v3';
