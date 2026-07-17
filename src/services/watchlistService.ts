import { SP500_SYMBOLS } from '../data/sp500Symbols';
import {
  STORAGE_KEY,
  WATCHLIST_IDS,
  type WatchlistId,
  type WatchlistsState,
} from '../types/watchlist';

const SYMBOL_SET = new Set<string>(SP500_SYMBOLS);

function sortSymbols(symbols: string[]): string[] {
  return [...symbols].sort((a, b) => a.localeCompare(b));
}

function createEmptyState(): WatchlistsState {
  return {
    sp500: sortSymbols([...SP500_SYMBOLS]),
    triggered: [],
    bought: [],
  };
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function sanitizeList(symbols: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const symbol of symbols) {
    const normalized = symbol.trim().toUpperCase();
    if (!SYMBOL_SET.has(normalized) || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }

  return sortSymbols(result);
}

function sanitizeState(raw: unknown): WatchlistsState | null {
  if (!raw || typeof raw !== 'object') return null;

  const candidate = raw as Partial<Record<WatchlistId, unknown>>;
  const next = createEmptyState();

  for (const id of WATCHLIST_IDS) {
    if (!isStringArray(candidate[id])) return null;
    next[id] = sanitizeList(candidate[id]);
  }

  const owned = new Set<string>([...next.triggered, ...next.bought]);
  next.sp500 = sortSymbols(SP500_SYMBOLS.filter((symbol) => !owned.has(symbol)));
  next.triggered = sortSymbols(next.triggered);
  next.bought = sortSymbols(next.bought);

  return next;
}

export function loadWatchlists(): WatchlistsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyState();

    const parsed = sanitizeState(JSON.parse(raw) as unknown);
    return parsed ?? createEmptyState();
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

export function findListForSymbol(
  state: WatchlistsState,
  symbol: string,
): WatchlistId | null {
  for (const id of WATCHLIST_IDS) {
    if (state[id].includes(symbol)) return id;
  }
  return null;
}

export function moveSymbol(
  state: WatchlistsState,
  symbol: string,
  to: WatchlistId,
): WatchlistsState {
  const from = findListForSymbol(state, symbol);
  if (!from || from === to) return state;

  const next: WatchlistsState = {
    sp500: state.sp500.filter((item) => item !== symbol),
    triggered: state.triggered.filter((item) => item !== symbol),
    bought: state.bought.filter((item) => item !== symbol),
  };

  next[to] = sortSymbols([...next[to], symbol]);
  return {
    sp500: sortSymbols(next.sp500),
    triggered: sortSymbols(next.triggered),
    bought: sortSymbols(next.bought),
  };
}

export function filterSymbols(symbols: string[], query: string): string[] {
  const trimmed = query.trim().toUpperCase();
  const source = sortSymbols(symbols);
  if (!trimmed) return source;
  return source.filter((symbol) => symbol.includes(trimmed));
}

/** TradingView accepts dotted share classes like BRK.B / BF.B. */
export function toTradingViewSymbol(symbol: string): string {
  return symbol;
}
