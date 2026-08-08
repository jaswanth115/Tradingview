import { FTMO_SYMBOLS } from '../data/ftmoSymbols';
import { SP500_SYMBOLS } from '../data/sp500Symbols';
import {
  BUCKET_IDS,
  DESK_IDS,
  STORAGE_KEY,
  type BucketId,
  type DeskId,
  type DeskState,
  type WatchlistsState,
} from '../types/watchlist';

const UNIVERSE_BY_DESK: Record<DeskId, readonly string[]> = {
  sp500: SP500_SYMBOLS,
  ftmo: FTMO_SYMBOLS,
};

const CANONICAL_BY_DESK: Record<DeskId, Map<string, string>> = {
  sp500: new Map(SP500_SYMBOLS.map((symbol) => [symbol.toUpperCase(), symbol])),
  ftmo: new Map(FTMO_SYMBOLS.map((symbol) => [symbol.toUpperCase(), symbol])),
};

function sortSymbols(symbols: string[]): string[] {
  return [...symbols].sort((a, b) => a.localeCompare(b));
}

function createDeskState(desk: DeskId): DeskState {
  return {
    universe: sortSymbols([...UNIVERSE_BY_DESK[desk]]),
    triggered: [],
    bought: [],
  };
}

function createEmptyState(): WatchlistsState {
  return {
    sp500: createDeskState('sp500'),
    ftmo: createDeskState('ftmo'),
  };
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function canonicalizeSymbol(desk: DeskId, symbol: string): string | null {
  return CANONICAL_BY_DESK[desk].get(symbol.trim().toUpperCase()) ?? null;
}

function sanitizeDeskList(desk: DeskId, symbols: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const symbol of symbols) {
    const canonical = canonicalizeSymbol(desk, symbol);
    if (!canonical || seen.has(canonical)) continue;
    seen.add(canonical);
    result.push(canonical);
  }

  return sortSymbols(result);
}

function rebuildDesk(
  desk: DeskId,
  triggeredRaw: string[],
  boughtRaw: string[],
): DeskState {
  const triggered = sanitizeDeskList(desk, triggeredRaw);
  const bought = sanitizeDeskList(desk, boughtRaw).filter(
    (symbol) => !triggered.includes(symbol),
  );
  const owned = new Set([...triggered, ...bought]);
  const universe = sortSymbols(
    UNIVERSE_BY_DESK[desk].filter((symbol) => !owned.has(symbol)),
  );

  return { universe, triggered, bought };
}

function sanitizeState(raw: unknown): WatchlistsState | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Record<string, unknown>;

  // v3 nested shape: { sp500: { universe, triggered, bought }, ftmo: {...} }
  if (
    candidate.sp500 &&
    typeof candidate.sp500 === 'object' &&
    candidate.ftmo &&
    typeof candidate.ftmo === 'object'
  ) {
    const next = createEmptyState();

    for (const desk of DESK_IDS) {
      const deskRaw = candidate[desk] as Partial<Record<BucketId, unknown>>;
      if (
        !isStringArray(deskRaw.universe) ||
        !isStringArray(deskRaw.triggered) ||
        !isStringArray(deskRaw.bought)
      ) {
        return null;
      }

      next[desk] = rebuildDesk(
        desk,
        deskRaw.triggered,
        deskRaw.bought,
      );
    }

    return next;
  }

  // Migrate flat v2: { sp500, ftmo, triggered, bought }
  if (
    isStringArray(candidate.sp500) &&
    isStringArray(candidate.triggered) &&
    isStringArray(candidate.bought)
  ) {
    return {
      sp500: rebuildDesk(
        'sp500',
        candidate.triggered,
        candidate.bought,
      ),
      ftmo: rebuildDesk('ftmo', [], []),
    };
  }

  return null;
}

function readLegacyJson(key: string): unknown | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as unknown) : null;
  } catch {
    return null;
  }
}

export function loadWatchlists(): WatchlistsState {
  try {
    const current = readLegacyJson(STORAGE_KEY);
    if (current) {
      return sanitizeState(current) ?? createEmptyState();
    }

    const v2 = readLegacyJson('sp500-watchlists-v2');
    if (v2) {
      return sanitizeState(v2) ?? createEmptyState();
    }

    const v1 = readLegacyJson('sp500-watchlists-v1');
    if (v1) {
      return sanitizeState(v1) ?? createEmptyState();
    }

    return createEmptyState();
  } catch {
    return createEmptyState();
  }
}

export function saveWatchlists(state: WatchlistsState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be unavailable (private mode / quota). Fail quietly.
  }
}

export function findBucketForSymbol(
  deskState: DeskState,
  symbol: string,
): BucketId | null {
  for (const bucket of BUCKET_IDS) {
    if (deskState[bucket].includes(symbol)) return bucket;
  }
  return null;
}

export function moveSymbol(
  state: WatchlistsState,
  desk: DeskId,
  symbol: string,
  to: BucketId,
): WatchlistsState {
  const canonical = canonicalizeSymbol(desk, symbol);
  if (!canonical) return state;

  const deskState = state[desk];
  const from = findBucketForSymbol(deskState, canonical);
  if (from === to) return state;

  const nextDesk: DeskState = {
    universe: deskState.universe.filter((item) => item !== canonical),
    triggered: deskState.triggered.filter((item) => item !== canonical),
    bought: deskState.bought.filter((item) => item !== canonical),
  };
  nextDesk[to] = sortSymbols([...nextDesk[to], canonical]);

  return {
    ...state,
    [desk]: {
      universe: sortSymbols(nextDesk.universe),
      triggered: sortSymbols(nextDesk.triggered),
      bought: sortSymbols(nextDesk.bought),
    },
  };
}

export function filterSymbols(symbols: string[], query: string): string[] {
  const trimmed = query.trim().toUpperCase();
  const source = sortSymbols(symbols);
  if (!trimmed) return source;
  return source.filter((symbol) => symbol.toUpperCase().includes(trimmed));
}

export function getMoveDestinations(currentBucket: BucketId): BucketId[] {
  return BUCKET_IDS.filter((id) => id !== currentBucket);
}

export function getBucketLabel(bucket: BucketId): string {
  if (bucket === 'triggered') return 'Trig';
  if (bucket === 'bought') return 'Buy';
  return 'All';
}
