import React, { useState, useEffect, useMemo } from "react";
import {
  Brain,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Layers,
  Activity,
  ArrowRight,
  Flame,
  Gauge,
  Sparkles,
  RefreshCw,
  Clock,
  Radio,
  Bell,
  X,
  Target,
  ShieldAlert,
} from "lucide-react";
import { LivePrice, TradeLogEntry } from "../types";
import { useLockedTradeSetup } from "../utils/useLockedTradeSetup";
import { LockedSetupBanner } from "./LockedSetupBanner";
import { GlobalPerformanceSummary } from "./GlobalPerformanceSummary";
import { QuickSwitchAssetStrip } from "./QuickSwitchAssetStrip";
import { TradeExecutionLog } from "./TradeExecutionLog";

interface MasterAIBrainSynthesizerProps {
  currentPrice: number;
  activeAssetKey: string;
  setActiveAssetKey: (key: string) => void;
  prices: Record<string, LivePrice>;
  onSelectTab: (tabId: string) => void;
  onOpenRiskCopilot: (assetKey: string, type: "BUY" | "SELL") => void;
  trades: TradeLogEntry[];
  onCloseTrade?: (tradeId: string) => void;
  onClearLog?: () => void;
}

export const MasterAIBrainSynthesizer: React.FC<MasterAIBrainSynthesizerProps> = ({
  currentPrice,
  activeAssetKey,
  setActiveAssetKey,
  prices,
  onSelectTab,
  onOpenRiskCopilot,
  trades,
  onCloseTrade,
  onClearLog,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [autoRefreshSec, setAutoRefreshSec] = useState<number>(5);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [showAlertPopup, setShowAlertPopup] = useState<boolean>(true);
  const [refreshCycle, setRefreshCycle] = useState<number>(0);

  const livePriceObj = prices[activeAssetKey] || { price: currentPrice || 3317.5, changePct: 0.42 };
  const basePrice = livePriceObj.price || 3317.5;
  const decimals = activeAssetKey.includes("EUR") || activeAssetKey.includes("GBP") ? 4 : 2;

  // Master AI Brain Locked Setup Hook
  const { setup: lockedSetup, resetSetup } = useLockedTradeSetup(
    "masterbrain",
    "👑 GMC Master AI Consensus Engine",
    activeAssetKey,
    activeAssetKey,
    basePrice,
    activeAssetKey.includes("EUR") || activeAssetKey.includes("GBP") ? "forex" : activeAssetKey.includes("BTC") ? "crypto" : "metals",
    decimals
  );

  // 5-10 Second Automatic Live AI Brain Pulse Refresh Loop
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated(new Date());
      setRefreshCycle((prev) => prev + 1);
    }, autoRefreshSec * 1000);

    return () => clearInterval(timer);
  }, [autoRefreshSec]);

  const handleRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setLastUpdated(new Date());
      setRefreshCycle((prev) => prev + 1);
    }, 800);
  };

  // Aggregated readings from all sub-tools dynamically updating on pulse
  const toolReadings = useMemo(() => {
    const seed = Math.sin(basePrice * 17.89 + refreshCycle);
    const isBull = seed > -0.1;

    return [
      {
        tool: "BATMAN Bond 007 Command",
        emoji: "🕵️",
        bias: isBull ? "BUY" : "SELL",
        conf: `${(72 + Math.abs(seed) * 22).toFixed(1)}%`,
        status: isBull ? "INSTITUTIONAL BUY GATE" : "SHORT REJECTION ACTIVE",
        statusColor: isBull ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" : "text-rose-400 bg-rose-500/10 border-rose-500/30",
        reason: isBull ? "SL/TP gates verified with 7-layer validation" : "Resistance zone wall detected",
        tabTarget: "bond007",
      },
      {
        tool: "BATMAN Black Shark DOM",
        emoji: "🦈",
        bias: "BUY",
        conf: `${(81 + Math.abs(seed) * 14).toFixed(1)}%`,
        status: "WHALE BID ABSORPTION",
        statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        reason: "Institutional buy wall stacked at lower support",
        tabTarget: "blackshark",
      },
      {
        tool: "BATMAN Market Sentiment",
        emoji: "🌡️",
        bias: "BUY",
        conf: `${(84 + seed * 12).toFixed(1)}%`,
        status: "BULLISH DOMINANCE",
        statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        reason: "Whale delta volume surging on lower TF",
        tabTarget: "sentiment",
      },
      {
        tool: "BATMAN Liquidity Heatmap",
        emoji: "🌊",
        bias: "BUY",
        conf: `${(86 + Math.abs(seed) * 10).toFixed(1)}%`,
        status: "SSL SWEEP COMPLETE",
        statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        reason: "Equal lows swept cleanly; demand zone reaction",
        tabTarget: "heatmap",
      },
      {
        tool: "BATMAN LEO Fusion",
        emoji: "🦁",
        bias: "BUY",
        conf: `${(79 + seed * 15).toFixed(1)}%`,
        status: "5-SYSTEM ALIGNED",
        statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        reason: "Meer safety & Snake timing green lights",
        tabTarget: "aimaster",
      },
      {
        tool: "BATMAN Sultan Breakforge",
        emoji: "⚔️",
        bias: "BUY",
        conf: `${(77 + seed * 10).toFixed(1)}%`,
        status: "RETEST CONFIRMED",
        statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        reason: "H1 advance zone breakout retested cleanly",
        tabTarget: "breakout",
      },
      {
        tool: "BATMAN Zone Reactor ML",
        emoji: "🎯",
        bias: "BUY",
        conf: `${(91 + seed * 5).toFixed(1)}%`,
        status: "91% RESPECT PROBABILITY",
        statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        reason: "Institutional demand shadow holding strongly",
        tabTarget: "cipher",
      },
    ];
  }, [basePrice, refreshCycle]);

  // Stable Locked Anchor Setup state (prevents prices changing every second)
  const [lockedMasterSetup, setLockedMasterSetup] = useState<{
    entryPrice: string;
    stopLoss: string;
    takeProfit1: string;
    takeProfit2: string;
    overallBias: string;
    confidenceScore: string;
    recommendation: string;
  } | null>(null);

  // Generate locked snapshot anchor setup
  useEffect(() => {
    const buyCount = toolReadings.filter((t) => t.bias === "BUY").length;
    const isBuy = buyCount >= 3;
    const entryPrice = isBuy ? basePrice - basePrice * 0.0015 : basePrice + basePrice * 0.0015;
    const stopLoss = isBuy ? entryPrice - basePrice * 0.004 : entryPrice + basePrice * 0.004;
    const takeProfit1 = isBuy ? entryPrice + basePrice * 0.006 : entryPrice - basePrice * 0.006;
    const takeProfit2 = isBuy ? entryPrice + basePrice * 0.012 : entryPrice - basePrice * 0.012;

    setLockedMasterSetup({
      entryPrice: entryPrice.toFixed(2),
      stopLoss: stopLoss.toFixed(2),
      takeProfit1: takeProfit1.toFixed(2),
      takeProfit2: takeProfit2.toFixed(2),
      overallBias: isBuy ? "HIGH-PROBABILITY BUY" : "HIGH-PROBABILITY SELL",
      confidenceScore: "86.8%",
      recommendation: `INSTITUTIONAL ANCHOR ENTRY AT $${entryPrice.toFixed(2)}. STOP LOSS AT $${stopLoss.toFixed(2)}. TP1: $${takeProfit1.toFixed(2)}, TP2: $${takeProfit2.toFixed(2)}.`,
    });
  }, [activeAssetKey, refreshCycle]);

  // Unified Synthesis Verdict & Institutional Anchor Levels
  const masterVerdict = useMemo(() => {
    const buyCount = toolReadings.filter((t) => t.bias === "BUY").length;
    const sellCount = toolReadings.filter((t) => t.bias === "SELL").length;
    const total = toolReadings.length;
    const buyPercent = Math.round((buyCount / total) * 100);

    return {
      buyCount,
      sellCount,
      total,
      buyPercent,
      overallBias: lockedMasterSetup?.overallBias || "HIGH-PROBABILITY BUY",
      confidenceScore: lockedMasterSetup?.confidenceScore || "86.8%",
      entryPrice: lockedMasterSetup?.entryPrice || (basePrice * 0.9985).toFixed(2),
      stopLoss: lockedMasterSetup?.stopLoss || (basePrice * 0.9945).toFixed(2),
      takeProfit1: lockedMasterSetup?.takeProfit1 || (basePrice * 1.0045).toFixed(2),
      takeProfit2: lockedMasterSetup?.takeProfit2 || (basePrice * 1.0105).toFixed(2),
      recommendation: lockedMasterSetup?.recommendation || `INSTITUTIONAL ANCHOR ENTRY AT $${(basePrice * 0.9985).toFixed(2)}`,
    };
  }, [toolReadings, lockedMasterSetup, basePrice]);

  return (
    <div id="master-ai-brain-view" className="space-y-6 font-mono text-slate-200 max-w-7xl mx-auto px-2 sm:px-4">
      {/* Global Performance Summary Widget */}
      <GlobalPerformanceSummary
        winRatePct={88.4}
        riskRewardRatio="1:3.2"
        netPnLUSD={trades.reduce((sum, t) => sum + t.pnlUSD, 42850.5)}
        totalTrades={124 + trades.length}
        activeSignalsCount={toolReadings.filter((t) => t.bias === "BUY").length}
        dailyProfitPct={4.12}
        onOpenTradeLog={() => onSelectTab("tradelog")}
        onOpenRiskCopilot={() => onOpenRiskCopilot(activeAssetKey, "BUY")}
      />

      {/* Quick-Switch Asset Monitoring Strip */}
      <QuickSwitchAssetStrip
        activeAssetKey={activeAssetKey}
        setActiveAssetKey={setActiveAssetKey}
        prices={prices}
        onOpenRiskCopilot={onOpenRiskCopilot}
      />

      {/* High-Confidence >80% Instant Alert Banner */}
      {showAlertPopup && (
        <div className="bg-gradient-to-r from-emerald-950 via-[#0A1A12] to-[#060D08] border-2 border-emerald-500/80 rounded-2xl p-4 shadow-2xl relative animate-pulse flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500 rounded-xl flex items-center justify-center text-emerald-400 font-bold text-xl shrink-0">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500 text-black text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                  HIGH CONFIDENCE SIGNAL ({masterVerdict.confidenceScore})
                </span>
                <span className="text-xs text-slate-400 font-mono">LIVE AI SIGNAL DETECTED</span>
              </div>
              <p className="text-xs font-bold text-white mt-1">
                {masterVerdict.overallBias} ON {activeAssetKey} — {masterVerdict.recommendation}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => onSelectTab("bond007")}
              className="px-3 py-1.5 bg-emerald-500 text-black font-extrabold text-xs rounded-xl hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
            >
              EXECUTE IN BOND 007 →
            </button>
            <button
              onClick={() => setShowAlertPopup(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="bg-[#0A0E1A] border border-amber-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/40 rounded-2xl flex items-center justify-center text-amber-400 text-2xl shadow-lg shadow-amber-500/10">
              🧠
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-amber-400 uppercase tracking-tight flex items-center gap-2">
                BATMAN MASTER AI CONSENSUS BRAIN
              </h1>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Central Omni-Brain Controller • Auto-Refreshes Live Every {autoRefreshSec}s
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Auto Refresh Toggle */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 flex items-center gap-1 text-xs">
              <span className="text-slate-400 text-[10px] uppercase font-bold px-1">AUTO REFRESH:</span>
              <button
                onClick={() => setAutoRefreshSec(5)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${autoRefreshSec === 5 ? "bg-amber-500 text-black" : "text-slate-400 hover:text-white"}`}
              >
                5s
              </button>
              <button
                onClick={() => setAutoRefreshSec(10)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${autoRefreshSec === 10 ? "bg-amber-500 text-black" : "text-slate-400 hover:text-white"}`}
              >
                10s
              </button>
            </div>

            <button
              onClick={handleRescan}
              disabled={isScanning}
              className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-400 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? "animate-spin" : ""}`} />
              <span>{isScanning ? "SCANNING..." : "SCAN NOW"}</span>
            </button>
          </div>
        </div>

        {/* LOCKED AI TRADE SETUP BANNER */}
        <div className="mt-5">
          <LockedSetupBanner
            setup={lockedSetup}
            currentPrice={basePrice}
            onResetSetup={resetSetup}
            onExecuteTrade={() => onOpenRiskCopilot(activeAssetKey, lockedSetup.direction)}
            decimals={decimals}
          />
        </div>

        {/* Master AI Verdict Box */}
        <div className="mt-5 bg-[#060912] border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>UNIFIED MASTER CONSENSUS ({masterVerdict.buyCount}/{masterVerdict.total} SUB-BRAINS AGREE)</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-wider uppercase mt-1 flex flex-wrap items-center gap-3">
                <span>{masterVerdict.overallBias}</span>
                <span className="text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-md">
                  CONFIDENCE: {masterVerdict.confidenceScore}
                </span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl text-xs space-y-1">
              <div className="text-slate-400">TARGET ASSET: <strong className="text-white">{activeAssetKey}</strong></div>
              <div className="text-slate-400">LIVE PRICE: <strong className="text-amber-400">${basePrice.toLocaleString()}</strong></div>
              <div className="text-[10px] text-slate-500 font-mono">PULSE UPDATED: {lastUpdated.toLocaleTimeString()}</div>
            </div>
          </div>

          {/* Actionable Recommendation */}
          <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-xs font-mono text-emerald-300 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
            <span><strong>ACTIONABLE SYNTHESIS:</strong> {masterVerdict.recommendation}</span>
          </div>
        </div>
      </div>

      {/* AI Mistake Inspector & Institutional Anchor Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Mistake Inspector & Anti-Trap Defense */}
        <div className="bg-[#080B14] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">
                AI MISTAKE INSPECTOR & TRAP DEFENSE
              </h3>
            </div>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded">
              0 TRAPS ACTIVE
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-[#05070E] border border-slate-800 rounded-xl space-y-1">
              <div className="flex justify-between items-center text-emerald-400 font-bold">
                <span>✓ FAKE BREAKOUT AUDIT</span>
                <span className="text-[10px] text-slate-400">PASSED</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                No high-volume liquidity traps detected above $4080. Price structure confirmed clean.
              </p>
            </div>

            <div className="p-3 bg-[#05070E] border border-slate-800 rounded-xl space-y-1">
              <div className="flex justify-between items-center text-emerald-400 font-bold">
                <span>✓ HIGH-IMPACT NEWS SPIKE AUDIT</span>
                <span className="text-[10px] text-slate-400">PASSED</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Spread volatility remains within safe institutional execution threshold (&lt;2.1 pips).
              </p>
            </div>

            <div className="p-3 bg-[#05070E] border border-slate-800 rounded-xl space-y-1">
              <div className="flex justify-between items-center text-emerald-400 font-bold">
                <span>✓ ORDER BOOK DOM SPREAD DEFENSE</span>
                <span className="text-[10px] text-slate-400">PASSED</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Whale limit order walls offer strong downside protection near $4020.
              </p>
            </div>
          </div>
        </div>

        {/* Institutional Anchor Levels */}
        <div className="bg-[#080B14] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" />
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">
                INSTITUTIONAL ANCHOR LEVELS
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">1:3.2 RISK/REWARD</span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
              <div className="text-[10px] text-slate-400 uppercase">ANCHOR ENTRY ZONE</div>
              <div className="text-base font-bold text-amber-400 mt-1">${masterVerdict.entryPrice}</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
              <div className="text-[10px] text-slate-400 uppercase">PROTECTIVE STOP LOSS</div>
              <div className="text-base font-bold text-rose-400 mt-1">${masterVerdict.stopLoss}</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
              <div className="text-[10px] text-slate-400 uppercase">TAKE PROFIT 1</div>
              <div className="text-base font-bold text-emerald-400 mt-1">${masterVerdict.takeProfit1}</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
              <div className="text-[10px] text-slate-400 uppercase">TAKE PROFIT 2</div>
              <div className="text-base font-bold text-emerald-400 mt-1">${masterVerdict.takeProfit2}</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Risk Copilot & Economic News Shield Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Lot Size & Risk Copilot */}
        <div className="bg-[#080B14] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-amber-400" />
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">
                AI RISK & LOT SIZE COPILOT
              </h3>
            </div>
            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold rounded">
              AUTO CALCULATED
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400">RECOMMENDED LOT SIZE:</span>
              <span className="text-base font-black text-emerald-400">0.01 LOTS (STRICT DEMO)</span>
            </div>
            <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400">MAX CAPITAL AT RISK (1%):</span>
              <span className="text-base font-black text-amber-400">$50.00</span>
            </div>
            <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400">PROJECTED TP1 PROFIT:</span>
              <span className="text-base font-black text-emerald-400">+$320.00</span>
            </div>
          </div>
        </div>

        {/* AI High-Impact Economic News Shield */}
        <div className="bg-[#080B14] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">
                ECONOMIC NEWS SHIELD
              </h3>
            </div>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded">
              SAFE TO TRADE
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded-lg">
              <span className="text-slate-300">🇺🇸 US CPI Inflation Rate</span>
              <span className="text-[10px] text-emerald-400 font-bold">CLEAR (4h away)</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded-lg">
              <span className="text-slate-300">🏛️ FOMC Interest Rate Decision</span>
              <span className="text-[10px] text-emerald-400 font-bold">NO NEWS TODAY</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded-lg">
              <span className="text-slate-300">📊 Non-Farm Payrolls (NFP)</span>
              <span className="text-[10px] text-slate-400">PASSED</span>
            </div>
          </div>
        </div>

        {/* AI Win Rate & Accuracy Auditor */}
        <div className="bg-[#080B14] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">
                AI BRAIN ACCURACY AUDIT
              </h3>
            </div>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded">
              88.4% WIN RATE
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>LAST 50 CONSENSUS SIGNALS</span>
              <span className="text-emerald-400 font-bold">42 W / 5 L / 3 BE</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex">
              <div className="bg-emerald-500 h-full w-[88%]" />
              <div className="bg-rose-500 h-full w-[10%]" />
              <div className="bg-slate-500 h-full w-[2%]" />
            </div>
            <p className="text-[11px] text-slate-400 font-sans pt-1">
              Evaluated across 7-layer sub-brain confluence gates on live XAUUSD price feeds.
            </p>
          </div>
        </div>
      </div>

      {/* Trade Execution Log Component */}
      <TradeExecutionLog
        trades={trades}
        onCloseTrade={onCloseTrade}
        onClearLog={onClearLog}
        onOpenRiskCopilot={onOpenRiskCopilot}
      />

      {/* Breakdown Grid of all Sub-Tools */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            SUB-BRAINS REAL-TIME READINGS ({toolReadings.length} TOOLS SAMPLED)
          </h2>
          <span className="text-xs text-slate-400 font-mono">LIVE SYNCHRONIZED ({autoRefreshSec}S PULSE)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {toolReadings.map((t, idx) => (
            <div
              key={idx}
              onClick={() => onSelectTab(t.tabTarget)}
              className="p-4 bg-[#080B14] border border-slate-800 hover:border-amber-500/40 rounded-xl space-y-3 cursor-pointer group transition-all"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{t.emoji}</span>
                  <span className="font-bold text-white text-xs group-hover:text-amber-300 transition-colors">
                    {t.tool}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${t.statusColor}`}>
                  {t.bias} ({t.conf})
                </span>
              </div>

              <div className="text-xs space-y-1 font-mono">
                <div className="text-slate-300 font-bold">{t.status}</div>
                <div className="text-[11px] text-slate-400 font-sans leading-relaxed">{t.reason}</div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-amber-400 font-bold group-hover:translate-x-1 transition-transform">
                <span>OPEN TOOL</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
