/// <reference types="vite/client" />

interface TradingViewWidgetOptions {
  autosize?: boolean;
  symbol: string;
  interval?: string;
  timezone?: string;
  theme?: 'light' | 'dark';
  style?: string;
  locale?: string;
  toolbar_bg?: string;
  enable_publishing?: boolean;
  allow_symbol_change?: boolean;
  container_id: string;
  backgroundColor?: string;
  gridColor?: string;
  hide_side_toolbar?: boolean;
  hide_top_toolbar?: boolean;
  save_image?: boolean;
  disabled_features?: string[];
}

interface TradingViewNamespace {
  widget: new (options: TradingViewWidgetOptions) => unknown;
}

interface Window {
  TradingView?: TradingViewNamespace;
}
