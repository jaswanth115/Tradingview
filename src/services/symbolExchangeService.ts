import exchangeMap from '../data/symbolExchanges.json';

const MANUAL_OVERRIDES: Record<string, string> = {
  'BRK.B': 'NYSE',
  BK: 'NYSE',
  SATS: 'NASDAQ',
  'BF.B': 'NYSE',
};

const EXCHANGE_BY_SYMBOL = new Map<string, string>([
  ...Object.entries(exchangeMap),
  ...Object.entries(MANUAL_OVERRIDES),
]);

export function getSymbolExchange(symbol: string): string | null {
  return EXCHANGE_BY_SYMBOL.get(symbol.toUpperCase()) ?? null;
}

export function toTradingViewSymbol(symbol: string): string {
  const exchange = getSymbolExchange(symbol);
  return exchange ? `${exchange}:${symbol}` : symbol;
}
