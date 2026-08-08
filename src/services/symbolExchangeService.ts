import exchangeMap from '../data/symbolExchanges.json';
import {
  getFtmoChartSymbol,
  getFtmoExchangeLabel,
} from '../data/ftmoChartSymbols';

const MANUAL_OVERRIDES: Record<string, string> = {
  'BRK.B': 'NYSE',
  BK: 'NYSE',
  SATS: 'NASDAQ',
  'BF.B': 'NYSE',
  BABA: 'NYSE',
  RACE: 'NYSE',
  ZM: 'NASDAQ',
  AZN: 'NASDAQ',
  WMT: 'NYSE',
};

const EXCHANGE_BY_SYMBOL = new Map<string, string>([
  ...Object.entries(exchangeMap),
  ...Object.entries(MANUAL_OVERRIDES),
]);

function lookupKey(symbol: string): string {
  return symbol.trim();
}

export function getSymbolExchange(symbol: string): string | null {
  const ftmoExchange = getFtmoExchangeLabel(lookupKey(symbol));
  if (ftmoExchange) return ftmoExchange;

  const upper = symbol.trim().toUpperCase();
  return (
    EXCHANGE_BY_SYMBOL.get(symbol.trim()) ??
    EXCHANGE_BY_SYMBOL.get(upper) ??
    null
  );
}

export function toTradingViewSymbol(symbol: string): string {
  const ftmoChart = getFtmoChartSymbol(lookupKey(symbol));
  if (ftmoChart) return ftmoChart;

  const exchange = getSymbolExchange(symbol);
  return exchange ? `${exchange}:${symbol}` : symbol;
}
