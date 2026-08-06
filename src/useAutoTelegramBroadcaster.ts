import { useEffect, useRef } from "react";
import {
  getTelegramConfig,
  dispatchSLTPResultToTelegram,
  sendTelegramMessage,
} from "./utils/telegram";
import {
  evaluateDualScenarioInstitutionalSetup,
  dispatchInstitutionalSignalToTelegram,
} from "./utils/institutionalSignalEngine";
import { getModuleTitle } from "./utils/moduleRegistry";
import { fetchLiveGoldPrice } from "./services/goldApiService";

export interface ActiveTelegramSignal {
  id: string;
  source: string;
  asset: "XAUUSD" | "BTCUSD";
  type: "BUY" | "SELL";
  entry: number;
  sl: number;
  tp1: number;
  tp2: number;
  tp3: number;
  tp4?: number;
  lotSize: number;
  confluence: string;
  status: "OPEN" | "TP_HIT" | "SL_HIT";
  createdAt: number;
}

const ACTIVE_TRADE_KEY = "gmc_master_active_signal_v3";
const BALANCE_KEY = "gmc_master_balance_v3";
const LAST_CLOSED_KEY = "gmc_master_last_closed_v3";

export function useAutoTelegramBroadcaster() {
  const activeTradeRef = useRef<ActiveTelegramSignal | null>(null);
  const balanceRef = useRef<number>(10240.50);
  const isProcessingRef = useRef<boolean>(false);
  const assetToggleRef = useRef<number>(0);

  useEffect(() => {
    // 1. Restore balance from storage
    const savedBalance = localStorage.getItem(BALANCE_KEY);
    if (savedBalance) {
      const parsed = parseFloat(savedBalance);
      if (!isNaN(parsed)) balanceRef.current = parsed;
    }

    // 2. Restore active trade state if available
    const savedTradeStr = localStorage.getItem(ACTIVE_TRADE_KEY);
    if (savedTradeStr) {
      try {
        const parsedTrade: ActiveTelegramSignal = JSON.parse(savedTradeStr);
        if (parsedTrade && parsedTrade.status === "OPEN") {
          activeTradeRef.current = parsedTrade;
        }
      } catch (e) {
        console.error("Failed to parse active trade from storage", e);
      }
    }

    // 3. Send initial startup welcome message once per browser session
    const startupSent = sessionStorage.getItem("gmc_auto_telegram_init_v10");
    if (!startupSent) {
      sessionStorage.setItem("gmc_auto_telegram_init_v10", "true");

      const initMessage = `
<b>👑 GMC SOVEREIGN AI BRAIN TELEGRAM BOT ONLINE</b>
━━━━━━━━━━━━━━━━━━━
<b>STATUS:</b> <code>REAL-TIME DUAL-SCENARIO MARKET MONITORING</code>
<b>TOP 2 ENGINES ACTIVE:</b>
• 1. ${getModuleTitle("aibrain")}
• 2. ${getModuleTitle("masterbrain")}
<b>SCENARIO EVALUATION:</b> <code>BUY vs SELL Confidence Comparison (A+ Trade Only)</code>
<b>STRICT LOT SIZE:</b> <code>0.01 LOT</code>
<b>COVERED ASSETS:</b> Gold (XAUUSD) & Crypto (BTCUSD)

<i>⚡ Dual-scenario institutional evaluation active! Only the higher probability setup with >=85% confidence is published.</i>
      `.trim();

      sendTelegramMessage(initMessage, "init-welcome-v10").catch(() => {});
    }

    // Helper: Fetch real-time price using dedicated Gold API or Binance for Crypto
    async function fetchLivePrice(asset: "XAUUSD" | "BTCUSD"): Promise<number | null> {
      try {
        if (asset === "XAUUSD") {
          const goldQuote = await fetchLiveGoldPrice();
          if (goldQuote && goldQuote.price) return goldQuote.price;
        } else {
          const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT`);
          if (res.ok) {
            const json = await res.json();
            if (json && json.price) {
              const price = parseFloat(json.price);
              if (!isNaN(price) && price > 0) return price;
            }
          }
        }
      } catch (err) {
        console.warn(`[GMC AI Brain] Price fetch error for ${asset}:`, err);
      }
      return null;
    }

    // Helper: Generate and broadcast dual-scenario setup for Top 2 Engines
    async function generateNewSignal() {
      const config = getTelegramConfig();
      if (!config.enabled) return;

      const asset: "XAUUSD" | "BTCUSD" = assetToggleRef.current % 2 === 0 ? "XAUUSD" : "BTCUSD";
      const engineId: "aibrain" | "masterbrain" = assetToggleRef.current % 4 < 2 ? "aibrain" : "masterbrain";
      assetToggleRef.current += 1;

      const livePrice = await fetchLivePrice(asset);
      if (!livePrice) return;

      // CONTINUOUS DUAL-SCENARIO ANALYSIS: BUY vs SELL
      const setup = evaluateDualScenarioInstitutionalSetup(engineId, asset, livePrice);
      if (!setup || !setup.passedRejectionFilters) return;

      const newTrade: ActiveTelegramSignal = {
        id: `master-${Date.now()}`,
        source: setup.engineName,
        asset,
        type: setup.direction,
        entry: setup.bestEntry,
        sl: setup.stopLoss,
        tp1: setup.tp1,
        tp2: setup.tp2,
        tp3: setup.tp3,
        tp4: setup.tp4,
        lotSize: 0.01,
        confluence: setup.reasonForEntry,
        status: "OPEN",
        createdAt: Date.now(),
      };

      activeTradeRef.current = newTrade;
      localStorage.setItem(ACTIVE_TRADE_KEY, JSON.stringify(newTrade));

      // Broadcast complete 15-field institutional Telegram signal
      await dispatchInstitutionalSignalToTelegram(setup);
    }

    // Main real-time monitoring loop running every 5 seconds
    const interval = setInterval(async () => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      try {
        const active = activeTradeRef.current;

        if (!active) {
          const lastClosedStr = localStorage.getItem(LAST_CLOSED_KEY);
          const lastClosedTime = lastClosedStr ? parseInt(lastClosedStr, 10) : 0;
          const elapsedSinceClose = Date.now() - lastClosedTime;

          if (elapsedSinceClose >= 45000) {
            await generateNewSignal();
          }
        } else {
          const currentPrice = await fetchLivePrice(active.asset);
          if (currentPrice !== null) {
            let isTP = false;
            let isSL = false;

            if (active.type === "BUY") {
              if (currentPrice >= active.tp1) isTP = true;
              else if (currentPrice <= active.sl) isSL = true;
            } else {
              if (currentPrice <= active.tp1) isTP = true;
              else if (currentPrice >= active.sl) isSL = true;
            }

            if (isTP || isSL) {
              const outcome: "TP_HIT" | "SL_HIT" = isTP ? "TP_HIT" : "SL_HIT";
              
              let pnlUSD = 0;
              if (active.asset === "XAUUSD") {
                pnlUSD = active.type === "BUY"
                  ? (currentPrice - active.entry) * 1.0
                  : (active.entry - currentPrice) * 1.0;
              } else {
                pnlUSD = active.type === "BUY"
                  ? (currentPrice - active.entry) * 0.01
                  : (active.entry - currentPrice) * 0.01;
              }
              pnlUSD = Number(pnlUSD.toFixed(2));

              balanceRef.current = Number((balanceRef.current + pnlUSD).toFixed(2));
              localStorage.setItem(BALANCE_KEY, balanceRef.current.toString());

              await dispatchSLTPResultToTelegram({
                source: active.source,
                asset: active.asset,
                type: active.type,
                outcome,
                pnlUSD,
                price: Number(currentPrice.toFixed(2)),
                accountBalance: balanceRef.current,
              });

              activeTradeRef.current = null;
              localStorage.removeItem(ACTIVE_TRADE_KEY);
              localStorage.setItem(LAST_CLOSED_KEY, Date.now().toString());
            }
          }
        }
      } catch (err) {
        console.error("[GMC AI Brain] Broadcaster loop error:", err);
      } finally {
        isProcessingRef.current = false;
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);
}
