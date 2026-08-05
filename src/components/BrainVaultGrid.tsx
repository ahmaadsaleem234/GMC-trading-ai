import React, { useState } from "react";
import {
  Smartphone,
  ArrowRight,
  Lock,
  CheckCircle2,
  Search,
  Sliders,
} from "lucide-react";

interface BrainVaultGridProps {
  onSelectTab: (tabId: string) => void;
  isLoggedIn: boolean;
  loggedInUser: string | null;
  onOpenLoginModal: () => void;
}

export const BrainVaultGrid: React.FC<BrainVaultGridProps> = ({
  onSelectTab,
  isLoggedIn,
  loggedInUser,
  onOpenLoginModal,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");

  const categories = [
    { id: "ALL", label: "SHOW ALL" },
    { id: "PRICE_ACTION", label: "PRICE ACTION" },
    { id: "SUPPORT_RESISTANCE", label: "SUPPORT & RESISTANCE" },
    { id: "SIGNALS", label: "SIGNALS" },
    { id: "GOLD", label: "GOLD" },
    { id: "VOLUME", label: "VOLUME BASED" },
    { id: "FORECASTING", label: "FORECASTING" },
  ];
  const topTools = [
    {
      id: "gmccap",
      title: "GMC Alpha 1H Trend Command Engine",
      emoji: "⚡",
      tag: "ALPHA H1 COMMAND",
      tagColor: "bg-amber-400/20 text-amber-300 border-amber-400/60 shadow-[0_0_12px_rgba(234,179,8,0.4)]",
      desc: "The supreme 1-Hour H1 Timeframe AI Brain Master — High precision institutional H1 zone matrix with live trade execution, supply/demand maps & scenarios",
      tabTarget: "gmccap",
      highlight: true,
    },
    {
      id: "harami",
      title: "GMC Reversal Rejection Neural Radar",
      emoji: "⚔️",
      tag: "REVERSAL RADAR",
      tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      desc: "Top 1 AI Master matrix synthesizing M15 order block sweeps with 99.1% Win Rate for Gold & BTC",
      tabTarget: "harami",
      highlight: true,
    },
    {
      id: "masterbrain",
      title: "GMC Sovereign AI Signal Fusion Core",
      emoji: "👑",
      tag: "FUSION CORE",
      tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      desc: "Reads signals from all sub-tools & synthesizes 1 unified Master Consensus verdict",
      tabTarget: "masterbrain",
      highlight: true,
    },
    {
      id: "bond007",
      title: "GMC Secret Agent Order Block Sniper",
      emoji: "🕵️‍♂️",
      tag: "SECRET AGENT",
      tagColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
      desc: "7-layer fusion • master verdict • London breaker block reclaim & high-precision sniper execution",
      tabTarget: "bond007",
      highlight: true,
    },
    {
      id: "institutional",
      title: "GMC Sovereign SMC Liquidity Desk",
      emoji: "🏛️",
      tag: "SOVEREIGN SMC",
      tagColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      desc: "Institutional Order Blocks, FVG imbalances, Premium/Discount zones & institutional liquidity sweep engine",
      tabTarget: "institutional",
      highlight: true,
    },
    {
      id: "blackshark",
      title: "GMC Apex Predator DOM & Depth Scanner",
      emoji: "🦈",
      tag: "PREDATOR DOM",
      tagColor: "bg-blue-500/20 text-blue-400 border-blue-500/40",
      desc: "Order-flow depth of market + institutional bid/ask wall radar for BTC & Gold",
      tabTarget: "blackshark",
      highlight: true,
    },
    {
      id: "sentiment",
      title: "GMC Macro Sentiment & Order Flow Gauge",
      emoji: "🎯",
      tag: "ORDER FLOW GAUGE",
      tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      desc: "Cross-reference AI signals with live order flow for real-time Bullish/Bearish confidence score",
      tabTarget: "sentiment",
    },
    {
      id: "heatmap",
      title: "GMC Deep Order Book Volatility Thermal",
      emoji: "🌋",
      tag: "VOLATILITY THERMAL",
      tagColor: "bg-blue-500/20 text-blue-400 border-blue-500/40",
      desc: "Clusters of stop-loss & take-profit pools • BSL/SSL entry & exit radar",
      tabTarget: "heatmap",
    },
    {
      id: "comparative",
      title: "GMC Cross-Asset Intermarket Scanner",
      emoji: "⚖️",
      tag: "INTERMARKET SCAN",
      tagColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      desc: "Dual asset side-by-side price action (Gold vs USD Index DXY) • divergence entry timing",
      tabTarget: "comparative",
    },
    {
      id: "aimaster",
      title: "GMC Vanguard 5-System Signal Matrix",
      emoji: "🦁",
      tag: "VANGUARD FUSION",
      tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      desc: "5-system ensemble: Command + AI Chains + BTL zones + Meer safety + Snake timing",
      tabTarget: "aimaster",
    },
    {
      id: "breakout",
      title: "GMC Kinetic Momentum Breakout Radar",
      emoji: "🚀",
      tag: "MOMENTUM BREAKOUT",
      tagColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
      desc: "XAUUSD H1 advance zone • breakout • retest • shadow setups + performance",
      tabTarget: "breakout",
    },
    {
      id: "aibrain",
      title: "GMC Quantum AI Trade Signal Director",
      emoji: "✨",
      tag: "QUANTUM DIRECTOR",
      tagColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
      desc: "69-voter consensus • GMC engine • hardening gates • MTF-aware verdict",
      tabTarget: "aibrain",
    },
    {
      id: "chart",
      title: "GMC Live Professional Charting Suite",
      emoji: "📊",
      tag: "CHARTING SUITE",
      tagColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
      desc: "Live XAUUSD & BTCUSD chart • zones, entries, volume profile and target map",
      tabTarget: "chart",
    },
    {
      id: "sniper",
      title: "GMC Micro Order Block Trigger Scanner",
      emoji: "🎯",
      tag: "ORDER BLOCK TRIGGER",
      tagColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
      desc: "Full XAUUSD & BTCUSD sniper dashboard • live order block price-action signals",
      tabTarget: "sniper",
    },
    {
      id: "nexus",
      title: "GMC Horizon Tactical Command Core",
      emoji: "⚡",
      tag: "HORIZON COMMAND",
      tagColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
      desc: "Gold intelligence platform • 10-agent council • calibrated probability • live zones",
      tabTarget: "nexus",
    },
    {
      id: "mtfdoji",
      title: "GMC Multi-Layer Supply & Demand Grid",
      emoji: "🔮",
      tag: "SUPPLY & DEMAND GRID",
      tagColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
      desc: "MTF Red Doji supply & demand zones matrix with real-time zone testing alerts",
      tabTarget: "mtfdoji",
    },
    {
      id: "cipher",
      title: "GMC Cyber-Reactor ML Pattern Predictor",
      emoji: "🤖",
      tag: "CYBER REACTOR ML",
      tagColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
      desc: "XAUUSD supply/demand ML • respect vs break probability • zone map • shadow track",
      tabTarget: "cipher",
    },
    {
      id: "doji",
      title: "GMC Stealth Candle Reversal Trigger",
      emoji: "🐍",
      tag: "STEALTH REVERSAL",
      tagColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
      desc: "Zone-lifecycle snake scanner • macro overlay • mechanical entry timing decision",
      tabTarget: "doji",
    },
    {
      id: "smc",
      title: "GMC Structural Market Cycle Engine",
      emoji: "🌊",
      tag: "MARKET CYCLE",
      tagColor: "bg-blue-500/20 text-blue-400 border-blue-500/40",
      desc: "Smart money flow, change of character (CHoCH) & market structure break radar",
      tabTarget: "smc",
    },
    {
      id: "falcon",
      title: "GMC Eagle-Eye Institutional Order Pilot",
      emoji: "🦅",
      tag: "EAGLE-EYE PILOT",
      tagColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
      desc: "High-altitude market scanner detecting institutional order block mitigation",
      tabTarget: "falcon",
    },
    {
      id: "brainspro",
      title: "GMC Multi-Agent AI Strategy Synthesizer",
      emoji: "🧠",
      tag: "STRATEGY SYNTHESIZER",
      tagColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      desc: "AI chains reasoning — multi-agent verdict aggregation and deep trade synthesis",
      tabTarget: "brainspro",
    },
    {
      id: "satoshi",
      title: "GMC Digital Asset Crypto Macro Desk",
      emoji: "🪙",
      tag: "CRYPTO MACRO DESK",
      tagColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
      desc: "BTCUSD institutional suite • order blocks, liquidity pools & real-time crypto setups",
      tabTarget: "satoshi",
    },
    {
      id: "liquidity",
      title: "GMC Market Liquidity & Depth Analyzer",
      emoji: "💧",
      tag: "DEPTH ANALYZER",
      tagColor: "bg-blue-500/20 text-blue-400 border-blue-500/40",
      desc: "Granular market depth map showing buy/sell stop liquidity build-up across pairs",
      tabTarget: "liquidity",
    },
    {
      id: "multitf",
      title: "GMC Multi-Timeframe Trend Alignment Engine",
      emoji: "📐",
      tag: "TREND ALIGNMENT",
      tagColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
      desc: "M15 • M30 • H1 • H4 • D1 sub-brain matrix — 14 voters per timeframe",
      tabTarget: "multitf",
    },
    {
      id: "whale",
      title: "GMC Whale Order Tracker & Big Money Radar",
      emoji: "🐳",
      tag: "BIG MONEY RADAR",
      tagColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
      desc: "XAUUSD & BTCUSD whale volume spike & Fair Value Gap (FVG) execution radar",
      tabTarget: "whale",
    },
    {
      id: "journal",
      title: "GMC AI Precision Trade Logger & Analytics",
      emoji: "📓",
      tag: "PRECISION JOURNAL",
      tagColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      desc: "Automated AI journal tracking every trade, analyzing mistakes & refining win rates",
      tabTarget: "journal",
    },
    {
      id: "equitytracker",
      title: "GMC Dynamic Portfolio Risk & Drawdown Monitor",
      emoji: "📈",
      tag: "RISK & EQUITY MONITOR",
      tagColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
      desc: "Live equity curve, peak-to-trough drawdown tracker & account risk telemetry",
      tabTarget: "equitytracker",
    },
    {
      id: "demoleaderboard",
      title: "GMC $5K Institutional Trader Hall",
      emoji: "🥇",
      tag: "TRADER HALL",
      tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      desc: "Live performance rankings of top algorithmic AI signal models",
      tabTarget: "demoleaderboard",
    },
    {
      id: "tradelog",
      title: "GMC Live Execution History & Ledger",
      emoji: "📜",
      tag: "EXECUTION HISTORY",
      tagColor: "bg-slate-500/20 text-slate-300 border-slate-500/40",
      desc: "Real-time log of every trade entry, stop-loss adjustment, and take-profit execution",
      tabTarget: "tradelog",
    },
    {
      id: "metrics",
      title: "GMC Quantitative Analytics & Win-Rate Lab",
      emoji: "📉",
      tag: "WIN-RATE LAB",
      tagColor: "bg-blue-500/20 text-blue-400 border-blue-500/40",
      desc: "Sharpe ratio, Profit Factor, win/loss breakdown & quantitative risk metrics",
      tabTarget: "metrics",
    },
    {
      id: "news",
      title: "GMC Macro Economic News Terminal",
      emoji: "📅",
      tag: "LIVE NEWS",
      tagColor: "bg-blue-500/20 text-blue-400 border-blue-500/40",
      desc: "Live economic calendar • high-impact CPI, NFP & FOMC alerts for XAUUSD & FX",
      tabTarget: "news",
    },
    {
      id: "ainews",
      title: "GMC AI Global News & Sentiment Desk",
      emoji: "📡",
      tag: "AI NEWS",
      tagColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      desc: "Real-time AI news scraper converting financial headlines into market bias scores",
      tabTarget: "ainews",
    },
    {
      id: "backtest",
      title: "GMC Quantitative Backtest Engine",
      emoji: "🔬",
      tag: "BACKTESTER",
      tagColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
      desc: "Historical strategy backtester testing GMC rules against 5+ years of market tick data",
      tabTarget: "backtest",
    },
    {
      id: "risk",
      title: "GMC Position Risk & Lot Calculator",
      emoji: "🧮",
      tag: "RISK CALCULATOR",
      tagColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
      desc: "Calculate exact lot sizes (0.01 standard) based on account balance & SL pip distance",
      tabTarget: "risk",
    },
    {
      id: "alerts",
      title: "GMC Real-Time Smart Price Alerts",
      emoji: "🔔",
      tag: "PRICE ALERTS",
      tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      desc: "Set custom price alerts for key order blocks, liquidity sweeps, and breakout triggers",
      tabTarget: "alerts",
    },
    {
      id: "vault",
      title: "GMC Master Brain Vault Hub",
      emoji: "🏰",
      tag: "BRAIN VAULT",
      tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      desc: "Central command vault housing all 35 GMC AI trading modules and intelligence engines",
      tabTarget: "vault",
    },
  ];

  const userId = isLoggedIn ? (loggedInUser || "AHMED") : "48e4ad7f";

  // Filter tools based on search and selected category
  const filteredTools = topTools.filter((tool) => {
    const matchesSearch = searchQuery
      ? tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.desc.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    if (!matchesSearch) return false;

    if (activeCategory === "ALL") return true;
    if (activeCategory === "PRICE_ACTION")
      return (
        tool.title.includes("SMC") ||
        tool.title.includes("Order Block") ||
        tool.title.includes("Harami") ||
        tool.title.includes("Doji")
      );
    if (activeCategory === "SUPPORT_RESISTANCE")
      return (
        tool.title.includes("Supply-Demand") ||
        tool.title.includes("Zone") ||
        tool.title.includes("Breakout")
      );
    if (activeCategory === "SIGNALS")
      return (
        tool.title.includes("Signal") ||
        tool.title.includes("Sniper") ||
        tool.title.includes("Fusion") ||
        tool.title.includes("Matrix")
      );
    if (activeCategory === "GOLD")
      return (
        tool.title.includes("Gold") ||
        tool.title.includes("XAUUSD") ||
        tool.desc.includes("Gold")
      );
    if (activeCategory === "VOLUME")
      return (
        tool.title.includes("Liquidity") ||
        tool.title.includes("Heatmap") ||
        tool.title.includes("DOM") ||
        tool.title.includes("Whale")
      );
    if (activeCategory === "FORECASTING")
      return (
        tool.title.includes("ML") ||
        tool.title.includes("Neural") ||
        tool.title.includes("AI") ||
        tool.title.includes("Predict")
      );

    return true;
  });

  return (
    <div
      id="brain-vault-grid"
      className="space-y-8 pb-16 font-sans text-slate-200 max-w-7xl mx-auto px-3 sm:px-6"
    >
      {/* 3D BRAIN VAULT HUB BANNER */}
      <div className="card-3d-gold rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center sm:text-left border border-amber-500/30">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-500/20 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 border border-amber-300/60 rounded-2xl flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              🏰
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gradient-gold uppercase tracking-tight flex items-center gap-2">
                GMC 3D BRAIN VAULT HUB
              </h1>
              <div className="text-xs text-amber-200/80 font-mono tracking-wider uppercase mt-1">
                INSTITUTIONAL QUANT SUITE • ALL 35 AI TRADING MODULES &amp; TOOLS
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/90 border border-amber-500/30 px-4 py-2.5 rounded-2xl text-xs font-mono shadow-inner">
              <span className="text-slate-400">Welcome, </span>
              <strong className="text-amber-300 font-black">{userId}</strong>
              <span className="text-slate-400"> — pick your 3D module</span>
            </div>

            <button
              onClick={onOpenLoginModal}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold border flex items-center gap-2 transition-all shadow-lg font-mono cursor-pointer ${
                isLoggedIn
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-emerald-500/10"
                  : "btn-3d-gold active:scale-95"
              }`}
            >
              {isLoggedIn ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Lock className="w-4 h-4 text-white" />
              )}
              <span>{isLoggedIn ? "TERMINAL ACTIVE" : "LOGIN 3D"}</span>
            </button>
          </div>
        </div>

        {/* Mobile App Download Prompt Bar */}
        <div className="mt-5 bg-[#0A101A] border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-[#BEF264]/10 border border-[#BEF264]/30 rounded-xl text-[#BEF264] shadow-[0_0_12px_rgba(190,242,100,0.2)]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-[#BEF264] uppercase tracking-wide text-sm">
                INSTALL GMC 3D AI APP
              </div>
              <div className="text-[11px] text-slate-300">
                iPhone • Android • Mac • PC — Free, instant, non-stop market monitoring
              </div>
            </div>
          </div>
          <button
            onClick={() => onSelectTab("bond007")}
            className="w-full sm:w-auto px-5 py-2.5 btn-neon-lime rounded-xl font-black flex items-center justify-center gap-2 transition-all text-xs cursor-pointer"
          >
            <span>LAUNCH APP</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>

      {/* Header & Filter Section */}
      <div className="pt-2 space-y-4">
        {/* Navigation Eyebrow */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono uppercase tracking-widest text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">GMC 3D AI VAULT</span>
            <span className="text-slate-600 font-bold">&gt;</span>
            <span className="text-slate-200 font-bold">QUANT MODULE LIBRARY</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#BEF264] animate-pulse" />
            <span className="text-[#BEF264] font-bold">GMC AI ENGINE ACTIVE</span>
          </div>
        </div>

        {/* Main Display Title */}
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none">
            GMC 3D AI Modules <br className="hidden sm:inline" />
            <span className="text-gradient-lime drop-shadow-[0_0_20px_rgba(190,242,100,0.25)]">
              &amp; Institutional Intelligence Suite
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-3xl">
            Original quantitative trading tools built in-house — smart-money market structure,
            volumetric order blocks, auto support &amp; resistance, liquidity heatmaps and AI Gold Matrix.
          </p>
        </div>

        {/* Search Capsule Bar */}
        <div className="pt-2 max-w-2xl">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 absolute left-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 3D library..."
              className="w-full bg-[#131821] border border-white/10 focus:border-[#B8F34A]/60 text-slate-100 placeholder:text-slate-500 rounded-full pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#B8F34A]/40 transition-all font-mono shadow-lg"
            />
          </div>
        </div>

        {/* Filter Badges Capsule Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar pt-2">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#090C14] border border-slate-800 rounded-full text-slate-400 text-xs font-mono uppercase font-bold whitespace-nowrap">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span>CATEGORIES</span>
          </div>

          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold font-mono tracking-wider transition-all uppercase whitespace-nowrap cursor-pointer ${
                  isActive ? "pill-filter-active" : "pill-filter-inactive"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Results Separator */}
        <div className="flex items-center gap-4 py-3">
          <div className="h-[1px] bg-slate-800 flex-1" />
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
            — {filteredTools.length} MODULES AVAILABLE —
          </span>
          <div className="h-[1px] bg-slate-800 flex-1" />
        </div>
      </div>

      {/* MODULE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => onSelectTab(tool.tabTarget)}
            className="bg-[#0A0D16] border border-slate-800/90 hover:border-[#BEF264]/50 rounded-2xl group cursor-pointer overflow-hidden flex flex-col justify-between p-6 space-y-4 relative transition-all duration-300 hover:shadow-[0_0_25px_rgba(190,242,100,0.12)] hover:-translate-y-0.5"
          >
            {/* Top Row: Emoji Icon, Title & Tag Badge */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-900 border border-slate-700/80 rounded-xl flex items-center justify-center text-2xl shadow-inner group-hover:border-[#BEF264]/40 transition-colors">
                    {tool.emoji}
                  </div>
                  <div>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md border ${tool.tagColor || "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"}`}>
                      {tool.tag}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-[10px] font-mono text-emerald-400 font-extrabold uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>3D READY</span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-xl font-black text-white group-hover:text-[#BEF264] transition-colors tracking-tight font-sans">
                  {tool.title}
                </h3>
                <p className="text-xs text-slate-300 font-normal leading-relaxed mt-2">
                  {tool.desc}
                </p>
              </div>
            </div>

            {/* Bottom Row: Tags & Launch Button */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-[#121826] border border-slate-700/70 text-slate-300 text-[10px] font-mono rounded-md px-2 py-0.5 font-bold">
                  XAUUSD &amp; BTC
                </span>
                <span className="bg-[#121826] border border-slate-700/70 text-amber-300 text-[10px] font-mono rounded-md px-2 py-0.5 font-bold">
                  INSTITUTIONAL
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#BEF264] group-hover:translate-x-1 transition-transform">
                <span>LAUNCH MODULE</span>
                <ArrowRight className="w-4 h-4 text-[#BEF264]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
