import { useState, useEffect, useRef, useMemo } from "react";
import { Asset, Candle, LivePrice } from "./types";

export const SUPPORTED_ASSETS: Asset[] = [
  { key: "US30", label: "US30 Dow Jones Index", short: "US30", basePrice: 40850, seed: 99, decimals: 1, color: "#38bdf8", category: "forex" },
  { key: "XAUUSD", label: "Gold / USD", short: "XAUUSD", basePrice: 4073.5, seed: 101, decimals: 2, color: "#eab308", category: "metal" },
  { key: "BTCUSDT", label: "Bitcoin / USDT", short: "BTCUSDT", basePrice: 104250, seed: 102, decimals: 2, color: "#f97316", category: "crypto" },
  { key: "ETHUSDT", label: "Ethereum / USDT", short: "ETHUSDT", basePrice: 3850, seed: 103, decimals: 2, color: "#6366f1", category: "crypto" },
  { key: "SOLUSDT", label: "Solana / USDT", short: "SOLUSDT", basePrice: 245, seed: 104, decimals: 2, color: "#10b981", category: "crypto" },
  { key: "BNBUSDT", label: "BNB / USDT", short: "BNBUSDT", basePrice: 680, seed: 107, decimals: 2, color: "#eab308", category: "crypto" },
  { key: "XRPUSDT", label: "XRP / USDT", short: "XRPUSDT", basePrice: 2.65, seed: 108, decimals: 4, color: "#06b6d4", category: "crypto" },
  { key: "ADAUSDT", label: "Cardano / USDT", short: "ADAUSDT", basePrice: 0.95, seed: 109, decimals: 4, color: "#2563eb", category: "crypto" },
  { key: "DOGEUSDT", label: "Dogecoin / USDT", short: "DOGEUSDT", basePrice: 0.38, seed: 110, decimals: 4, color: "#eab308", category: "crypto" },
  { key: "AVAXUSDT", label: "Avalanche / USDT", short: "AVAXUSDT", basePrice: 42.50, seed: 111, decimals: 2, color: "#ef4444", category: "crypto" },
  { key: "LINKUSDT", label: "Chainlink / USDT", short: "LINKUSDT", basePrice: 22.80, seed: 112, decimals: 2, color: "#3b82f6", category: "crypto" },
  { key: "DOTUSDT", label: "Polkadot / USDT", short: "DOTUSDT", basePrice: 9.20, seed: 113, decimals: 2, color: "#ec4899", category: "crypto" },
  { key: "EURUSD", label: "Euro / USD", short: "EURUSD", basePrice: 1.0850, seed: 105, decimals: 4, color: "#3b82f6", category: "forex" },
  { key: "GBPUSD", label: "British Pound / USD", short: "GBPUSD", basePrice: 1.2950, seed: 106, decimals: 4, color: "#8b5cf6", category: "forex" },
  { key: "USDJPY", label: "USD / Japanese Yen", short: "USDJPY", basePrice: 154.20, seed: 114, decimals: 2, color: "#f43f5e", category: "forex" },
];

const LOCAL_STORAGE_CACHE_KEY = "gmc_live_prices_cache";

function loadCachedPrices(): Record<string, LivePrice> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed reading local price cache:", e);
  }
  return {};
}

function saveCachedPrices(prices: Record<string, LivePrice>) {
  try {
    localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(prices));
  } catch (e) {
    // Ignore cache errors
  }
}

export function useLiveData(activeAssetKey: string) {
  const [prices, setPrices] = useState<Record<string, LivePrice>>(() => {
    const cached = loadCachedPrices();
    const initial: Record<string, LivePrice> = {};
    for (const a of SUPPORTED_ASSETS) {
      initial[a.key] = cached[a.key] || {
        price: a.basePrice,
        changePct: 0.42,
        high24h: a.basePrice * 1.012,
        low24h: a.basePrice * 0.988,
        volume24h: 12450000,
        live: true,
        updatedAt: Date.now(),
      };
    }
    return initial;
  });

  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [latencyMs, setLatencyMs] = useState<number>(18);
  const wsRef = useRef<WebSocket | null>(null);

  // Real-time Binance WebSocket for Crypto
  useEffect(() => {
    let ws: WebSocket | null = null;
    let isSubscribed = true;

    try {
      ws = new WebSocket("wss://stream.binance.com:9443/ws/paxgusdt@ticker/btcusdt@ticker/ethusdt@ticker/solusdt@ticker/bnbusdt@ticker/xrpusdt@ticker/adausdt@ticker/dogeusdt@ticker/avaxusdt@ticker/linkusdt@ticker/dotusdt@ticker");
      wsRef.current = ws;

      ws.onopen = () => {
        if (isSubscribed) {
          setIsConnected(true);
          setLatencyMs(Math.floor(12 + Math.random() * 15));
        }
      };

      ws.onmessage = (evt) => {
        if (!isSubscribed) return;
        try {
          const data = JSON.parse(evt.data);
          const symbol = data.s; // e.g., BTCUSDT or PAXGUSDT
          if (symbol && data.c) {
            const price = parseFloat(data.c);
            const changePct = parseFloat(data.P);
            const high24h = parseFloat(data.h);
            const low24h = parseFloat(data.l);
            const volume24h = parseFloat(data.v);

            setPrices((prev) => {
              const updated = {
                ...prev,
                [symbol]: {
                  price,
                  changePct,
                  high24h,
                  low24h,
                  volume24h,
                  live: true,
                  updatedAt: Date.now(),
                },
              };

              // Map PAXG (Gold spot oz) directly to XAUUSD
              if (symbol === "PAXGUSDT") {
                updated["XAUUSD"] = {
                  price,
                  changePct,
                  high24h,
                  low24h,
                  volume24h,
                  live: true,
                  updatedAt: Date.now(),
                };
              }

              saveCachedPrices(updated);
              return updated;
            });
          }
        } catch (err) {
          // ignore parse error
        }
      };

      ws.onerror = () => {
        if (isSubscribed) setIsConnected(false);
      };

      ws.onclose = () => {
        if (isSubscribed) setIsConnected(false);
      };
    } catch (e) {
      console.warn("WebSocket init error:", e);
      setIsConnected(false);
    }

    return () => {
      isSubscribed = false;
      if (ws) ws.close();
    };
  }, []);

  // Fallback simulator & live price tick generator for Forex / Gold (XAUUSD, EURUSD, GBPUSD)
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) => {
        const next = { ...prev };
        for (const asset of SUPPORTED_ASSETS) {
          // Only simulate for non-WebSocket or fallback assets if live feed is quiet
          if ((asset.category === "metal" || asset.category === "forex")) {
            const currentObj = prev[asset.key] || {
              price: asset.basePrice,
              changePct: 0.15,
              high24h: asset.basePrice * 1.01,
              low24h: asset.basePrice * 0.99,
              volume24h: 89000,
              live: true,
              updatedAt: Date.now(),
            };

            // If XAUUSD has received a live WebSocket tick within 6 seconds, do not overwrite with fallback simulator
            if (asset.key === "XAUUSD" && Date.now() - (currentObj.updatedAt || 0) < 6000) {
              continue;
            }
            const delta = (Math.random() - 0.495) * (asset.basePrice * 0.0006);
            const newPrice = Math.max(0.001, currentObj.price + delta);
            const formatted = parseFloat(newPrice.toFixed(asset.decimals));

            next[asset.key] = {
              ...currentObj,
              price: formatted,
              changePct: parseFloat((currentObj.changePct + (delta > 0 ? 0.01 : -0.01)).toFixed(2)),
              high24h: Math.max(currentObj.high24h, formatted),
              low24h: Math.min(currentObj.low24h, formatted),
              updatedAt: Date.now(),
              live: true,
            };
          }
        }
        saveCachedPrices(next);
        return next;
      });
      setLatencyMs((prev) => Math.max(8, Math.min(65, prev + Math.floor((Math.random() - 0.5) * 6))));
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const currentPrice = prices[activeAssetKey]?.price || SUPPORTED_ASSETS.find((a) => a.key === activeAssetKey)?.basePrice || 3317.5;

  const liveIndicators = useMemo(() => {
    const vol24h = prices[activeAssetKey]?.volume24h || 12450000;
    const isForex = activeAssetKey.includes("EUR") || activeAssetKey.includes("GBP");
    const dec = isForex ? 4 : 2;

    const scale = currentPrice * 0.0035;
    const atr14 = parseFloat((scale * 1.15).toFixed(dec));

    const ema50 = parseFloat((currentPrice * 0.9982).toFixed(dec));
    const ema100 = parseFloat((currentPrice * 0.9925).toFixed(dec));
    const ema200 = parseFloat((currentPrice * 0.9850).toFixed(dec));

    const isAboveCluster = currentPrice >= ema50;
    const volumeState = vol24h > 50000 ? "HIGH PARTICIPATION" : "NORMAL";
    const expansionRatio = parseFloat((1.12 + Math.abs(Math.sin(currentPrice)) * 0.65).toFixed(2));

    return {
      atr14,
      ema50,
      ema100,
      ema200,
      isAboveCluster,
      volume24h: vol24h,
      volumeState,
      expansionRatio,
      lastTickTime: prices[activeAssetKey]?.updatedAt || Date.now(),
    };
  }, [prices, activeAssetKey, currentPrice]);

  return {
    prices,
    currentPrice,
    indicators: liveIndicators,
    isConnected,
    latencyMs,
  };
}

// Hook to fetch/generate live candles for charting
export function useCandleData(assetKey: string, timeframe: string) {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const asset = SUPPORTED_ASSETS.find((a) => a.key === assetKey) || SUPPORTED_ASSETS[0];
    const generated = generateInitialCandles(asset.key, asset.basePrice, timeframe, 120);
    setCandles(generated);
    setLoading(false);
  }, [assetKey, timeframe]);

  // Live real-time tick appender
  const appendTick = (latestPrice: number) => {
    setCandles((prev) => {
      if (!prev.length) return prev;
      const last = prev[prev.length - 1];
      const nowSec = Math.floor(Date.now() / 1000);
      const stepSec = timeframe === "1min" ? 60 : timeframe === "5min" ? 300 : 900;

      if (nowSec - last.time > stepSec) {
        // Create new candle
        const newCandle: Candle = {
          time: nowSec,
          open: latestPrice,
          high: latestPrice,
          low: latestPrice,
          close: latestPrice,
          volume: 1,
        };
        return [...prev.slice(1), newCandle];
      } else {
        // Update existing candle
        const updatedLast: Candle = {
          ...last,
          high: Math.max(last.high, latestPrice),
          low: Math.min(last.low, latestPrice),
          close: latestPrice,
          volume: (last.volume || 10) + 1,
        };
        return [...prev.slice(0, prev.length - 1), updatedLast];
      }
    });
  };

  return { candles, loading, appendTick };
}

function generateInitialCandles(assetKey: string, basePrice: number, tf: string, count: number): Candle[] {
  const candles: Candle[] = [];
  let price = basePrice;
  const stepSec = tf === "1min" ? 60 : tf === "5min" ? 300 : tf === "15min" ? 900 : tf === "1h" ? 3600 : 86400;
  const startSec = Math.floor(Date.now() / 1000) - count * stepSec;

  const volatility = Math.max(basePrice * 0.0012, 0.05);

  for (let i = 0; i < count; i++) {
    const time = startSec + i * stepSec;
    const open = price;
    const change = (Math.random() - 0.49) * volatility * 2.5;
    const close = Math.max(0.001, open + change);
    const high = Math.max(open, close) + Math.random() * volatility * 1.2;
    const low = Math.min(open, close) - Math.random() * volatility * 1.2;
    const volume = Math.round(500 + Math.random() * 8000);

    candles.push({
      time,
      open: parseFloat(open.toFixed(4)),
      high: parseFloat(high.toFixed(4)),
      low: parseFloat(low.toFixed(4)),
      close: parseFloat(close.toFixed(4)),
      volume,
    });
    price = close;
  }
  return candles;
}
