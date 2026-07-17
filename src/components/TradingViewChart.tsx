import { useEffect, useId, useRef } from 'react';
import {
  getSymbolExchange,
  toTradingViewSymbol,
} from '../services/symbolExchangeService';

const SCRIPT_ID = 'tradingview-widget-script';
const SCRIPT_SRC = 'https://s3.tradingview.com/tv.js';

type TradingViewChartProps = {
  symbol: string;
};

function ensureTradingViewScript(onReady: () => void): () => void {
  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

  if (window.TradingView) {
    onReady();
    return () => undefined;
  }

  if (existing) {
    existing.addEventListener('load', onReady);
    return () => existing.removeEventListener('load', onReady);
  }

  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.src = SCRIPT_SRC;
  script.async = true;
  script.addEventListener('load', onReady);
  document.head.appendChild(script);

  return () => script.removeEventListener('load', onReady);
}

export function TradingViewChart({ symbol }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerId = useId().replace(/:/g, '');
  const chartSymbol = toTradingViewSymbol(symbol);
  const exchange = getSymbolExchange(symbol);

  useEffect(() => {
    let cancelled = false;

    const createWidget = () => {
      if (cancelled || !window.TradingView || !containerRef.current) return;

      containerRef.current.innerHTML = '';

      new window.TradingView.widget({
        autosize: true,
        symbol: chartSymbol,
        interval: '60',
        timezone: 'America/New_York',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#000000',
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: containerId,
        backgroundColor: '#000000',
        gridColor: 'rgba(255, 255, 255, 0.06)',
        hide_side_toolbar: false,
        hide_top_toolbar: false,
        save_image: false,
        disabled_features: ['create_volume_indicator_by_default'],
      });
    };

    const cleanup = ensureTradingViewScript(createWidget);
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [chartSymbol, containerId]);

  return (
    <section className="chart-pane" aria-label={`${symbol} chart`}>
      {exchange ? (
        <div className="chart-exchange-badge">
          <span className="chart-exchange-label">Exchange</span>
          <span className="chart-exchange-value">{exchange}</span>
        </div>
      ) : null}
      <div id={containerId} ref={containerRef} className="chart-container" />
    </section>
  );
}
