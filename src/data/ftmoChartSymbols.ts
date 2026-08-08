/**
 * Map FTMO broker CFD tickers to TradingView chart symbols.
 * US tickers usually match 1:1; EU names often use different TV codes.
 */
export const FTMO_CHART_SYMBOLS: Record<string, string> = {
  AAPL: 'NASDAQ:AAPL',
  ADSGn: 'XETR:ADS',
  AIRF: 'EURONEXT:AF',
  ALVG: 'XETR:ALV',
  AMZN: 'NASDAQ:AMZN',
  BA: 'NYSE:BA',
  BABA: 'NYSE:BABA',
  BAC: 'NYSE:BAC',
  BAYGn: 'XETR:BAYN',
  CSCO: 'NASDAQ:CSCO',
  CVX: 'NYSE:CVX',
  DBKGn: 'XETR:DBK',
  DIS: 'NYSE:DIS',
  META: 'NASDAQ:META',
  FDX: 'NYSE:FDX',
  GE: 'NYSE:GE',
  GM: 'NYSE:GM',
  GOOG: 'NASDAQ:GOOG',
  IBE: 'BME:IBE',
  IBM: 'NYSE:IBM',
  INTC: 'NASDAQ:INTC',
  JNJ: 'NYSE:JNJ',
  JPM: 'NYSE:JPM',
  KO: 'NYSE:KO',
  LVMH: 'EURONEXT:MC',
  MCD: 'NYSE:MCD',
  MSFT: 'NASDAQ:MSFT',
  NFLX: 'NASDAQ:NFLX',
  NVDA: 'NASDAQ:NVDA',
  PFE: 'NYSE:PFE',
  QCOM: 'NASDAQ:QCOM',
  RACE: 'NYSE:RACE',
  SAN: 'BME:SAN',
  SIEGn: 'XETR:SIE',
  T: 'NYSE:T',
  TSLA: 'NASDAQ:TSLA',
  V: 'NYSE:V',
  VOWG_p: 'XETR:VOW3',
  WMT: 'NYSE:WMT',
  XOM: 'NYSE:XOM',
  ZM: 'NASDAQ:ZM',
  RTX: 'NYSE:RTX',
  LMT: 'NYSE:LMT',
  PLTR: 'NASDAQ:PLTR',
  AMD: 'NASDAQ:AMD',
  AVGO: 'NASDAQ:AVGO',
  SBUX: 'NASDAQ:SBUX',
  MSTR: 'NASDAQ:MSTR',
  GME: 'NYSE:GME',
  NKE: 'NYSE:NKE',
  ARM: 'NASDAQ:ARM',
  SNOW: 'NYSE:SNOW',
  ASML: 'NASDAQ:ASML',
  AZN: 'NASDAQ:AZN',
  'BRK.B': 'NYSE:BRK.B',
  TTE: 'EURONEXT:TTE',
  BMW: 'XETR:BMW',
  MBG: 'XETR:MBG',
  // SpaceX is not publicly listed; leave bare and let TradingView resolve if possible.
  SPCX: 'SPCX',
};

export function getFtmoChartSymbol(symbol: string): string | null {
  return FTMO_CHART_SYMBOLS[symbol] ?? null;
}

export function getFtmoExchangeLabel(symbol: string): string | null {
  const chartSymbol = getFtmoChartSymbol(symbol);
  if (!chartSymbol || !chartSymbol.includes(':')) return null;
  return chartSymbol.split(':')[0] ?? null;
}
