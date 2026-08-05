import React, { useState } from "react";
import {
  Activity,
  ShieldAlert,
  Cpu,
  BarChart3,
  Radio,
  Sliders,
  Bell,
  Globe,
  RefreshCw,
  Zap,
  TrendingUp,
  Flame,
  Lock,
  UserCheck,
  Menu,
  X,
  PieChart,
  Search,
  Trophy,
  BookOpen,
  ArrowLeft,
  Home,
  Crown,
  LayoutGrid,
  ChevronRight,
  Filter,
} from "lucide-react";
import { SUPPORTED_ASSETS } from "../useLiveData";
import { LivePrice } from "../types";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeAssetKey: string;
  setActiveAssetKey: (key: string) => void;
  prices: Record<string, LivePrice>;
  isConnected: boolean;
  latencyMs: number;
  isLoggedIn: boolean;
  loggedInUser: string | null;
  onOpenLoginModal: () => void;
  onOpenHeatmapOverlay?: () => void;
  onGoBack?: () => void;
  onGoHome?: () => void;
}

export interface NavItem {
  id: string;
  label: string;
  icon: any;
  category: "Core" | "AI Intelligence" | "Signals" | "Market Data" | "Analytics" | "Tools" | "News" | "Admin";
  desc: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "landing", label: "🌐 GMC TRADING AI™ Institutional Landing Portal", icon: Globe, category: "Core", desc: "Institutional public overview, features matrix & public AI architecture" },
  { id: "gmcgold", label: "👑 GMC GOLD Apex Bank-Zone Matrix", icon: Crown, category: "Core", desc: "Top #1 Bank-Zone liquidity matrix, Gold institutional order blocks & zone maps" },
  { id: "d3heatmap", label: "🔥 GMC D3 Institutional Liquidity Heatmap", icon: Flame, category: "Core", desc: "Interactive D3 liquidity thermal map & real-time order book cluster radar" },
  { id: "gmccap", label: "⚡ GMC Alpha 1H Trend Command Engine", icon: Cpu, category: "Core", desc: "1-Hour H1 trend command engine with high precision institutional zones" },
  { id: "harami", label: "⚔️ GMC Reversal Rejection Neural Radar", icon: Cpu, category: "Core", desc: "M15 order block reversal rejection neural radar with 99.1% Win Rate" },
  { id: "demoleaderboard", label: "🥇 GMC $5K Institutional Trader Hall", icon: Trophy, category: "Core", desc: "Live $5,000 demo account ranking & institutional trader performance matrix" },
  { id: "journal", label: "📓 GMC AI Precision Trade Logger & Analytics", icon: BookOpen, category: "AI Intelligence", desc: "AI trade logger, execution journal, risk metrics & performance analytics" },
  { id: "institutional", label: "🏛️ GMC Sovereign SMC Liquidity Desk", icon: Zap, category: "Core", desc: "Smart Money Concepts (SMC) order blocks & Fair Value Gap (FVG) scanner" },
  { id: "equitytracker", label: "📈 GMC Dynamic Portfolio Risk & Drawdown Monitor", icon: PieChart, category: "Analytics", desc: "Portfolio equity curve, dynamic drawdown monitor & risk metrics" },
  { id: "vault", label: "🏰 GMC Central Intelligence Vault & Archive", icon: Cpu, category: "Core", desc: "Central intelligence hub displaying all 38+ AI trading modules" },
  { id: "masterbrain", label: "👑 GMC Sovereign AI Signal Fusion Core", icon: Cpu, category: "Core", desc: "Sovereign signal fusion core synthesizing multi-agent consensus" },
  { id: "bond007", label: "🕵️‍♂️ GMC Secret Agent Order Block Sniper", icon: ShieldAlert, category: "Core", desc: "Secret agent order block sniper with London breaker reclaim timing" },
  { id: "sentiment", label: "🎯 GMC Macro Sentiment & Order Flow Gauge", icon: Activity, category: "Core", desc: "Macro sentiment gauge & real-time order flow volume absorber" },
  { id: "heatmap", label: "🌋 GMC Deep Order Book Volatility Thermal", icon: Activity, category: "Core", desc: "Deep order book volatility thermal map & BSL/SSL pools radar" },
  { id: "comparative", label: "⚖️ GMC Cross-Asset Intermarket Scanner", icon: BarChart3, category: "Core", desc: "Cross-asset intermarket scanner (XAUUSD vs USD Index DXY correlation)" },
  { id: "blackshark", label: "🦈 GMC Apex Predator DOM & Depth Scanner", icon: Cpu, category: "Core", desc: "Apex predator depth of market (DOM) & order flow bid/ask wall scanner" },
  { id: "aimaster", label: "🦁 GMC Vanguard 5-System Signal Matrix", icon: Zap, category: "Signals", desc: "Vanguard 5-system signal matrix ensemble (Command + AI + BTL + Meer + Snake)" },
  { id: "breakout", label: "🚀 GMC Kinetic Momentum Breakout Radar", icon: TrendingUp, category: "Signals", desc: "Kinetic momentum breakout radar with advance zone retest signals" },
  { id: "aibrain", label: "✨ GMC Quantum AI Trade Signal Director", icon: Cpu, category: "AI Intelligence", desc: "Quantum AI trade signal director with 69-voter consensus engine" },
  { id: "chart", label: "📊 GMC Live Professional Charting Suite", icon: BarChart3, category: "Core", desc: "Live professional charting suite with multi-asset price action" },
  { id: "tradelog", label: "📜 GMC Live Execution History & Ledger", icon: Cpu, category: "Analytics", desc: "Live execution history, order ledger & closed trade audit history" },
  { id: "metrics", label: "📉 GMC Quantitative Analytics & Win-Rate Lab", icon: PieChart, category: "Analytics", desc: "Quantitative win-rate lab & statistical edge analyzer" },
  { id: "sniper", label: "🎯 GMC Micro Order Block Trigger Scanner", icon: Zap, category: "Signals", desc: "Micro order block trigger scanner for M1/M5 sniper entries" },
  { id: "nexus", label: "⚡ GMC Horizon Tactical Command Core", icon: Zap, category: "Signals", desc: "Horizon tactical command core with 10-agent council" },
  { id: "mtfdoji", label: "🔮 GMC Multi-Layer Supply & Demand Grid", icon: Flame, category: "Signals", desc: "Multi-layer supply & demand grid with red doji testing alerts" },
  { id: "cipher", label: "🤖 GMC Cyber-Reactor ML Pattern Predictor", icon: Cpu, category: "Signals", desc: "Cyber-reactor ML pattern predictor for zone respect probabilities" },
  { id: "doji", label: "🐍 GMC Stealth Candle Reversal Trigger", icon: Flame, category: "Signals", desc: "Stealth candle reversal trigger with zone-lifecycle tracking" },
  { id: "smc", label: "🌊 GMC Structural Market Cycle Engine", icon: Zap, category: "Signals", desc: "Structural market cycle engine (BOS, CHoCH, Liquidity Sweeps)" },
  { id: "falcon", label: "🦅 GMC Eagle-Eye Institutional Order Pilot", icon: Radio, category: "Signals", desc: "Eagle-eye institutional order pilot for high-altitude market scans" },
  { id: "brainspro", label: "🧠 GMC Multi-Agent AI Strategy Synthesizer", icon: Cpu, category: "AI Intelligence", desc: "Multi-agent AI strategy synthesizer & deep reasoning chains" },
  { id: "satoshi", label: "🪙 GMC Digital Asset Crypto Macro Desk", icon: Radio, category: "Market Data", desc: "Digital asset crypto macro desk for Bitcoin & Ethereum" },
  { id: "liquidity", label: "💧 GMC Market Liquidity & Depth Analyzer", icon: Activity, category: "Market Data", desc: "Market liquidity depth analyzer & stop pool clusters" },
  { id: "multitf", label: "📐 GMC Multi-Timeframe Trend Alignment Engine", icon: BarChart3, category: "Market Data", desc: "Multi-timeframe trend alignment engine (M5 to D1 trend sync)" },
  { id: "whale", label: "🐳 GMC Whale Order Tracker & Big Money Radar", icon: Activity, category: "Market Data", desc: "Whale order tracker & big money institutional order radar" },
  { id: "news", label: "📅 GMC Global Macro Economic Desk", icon: Globe, category: "News", desc: "Global macro economic calendar & high impact news desk" },
  { id: "ainews", label: "📡 GMC AI Sentiment & Live Breaking Desk", icon: Globe, category: "News", desc: "AI sentiment & breaking economic news analyzer" },
  { id: "backtest", label: "🔬 GMC High-Frequency Quantitative Strategy Lab", icon: RefreshCw, category: "Tools", desc: "High-frequency quantitative strategy backtesting lab" },
  { id: "risk", label: "🧮 GMC Capital Risk & Position Size Calculator", icon: Sliders, category: "Tools", desc: "Capital risk, position size & lot size calculator" },
  { id: "alerts", label: "🔔 GMC Intelligent Price Alert Dispatcher", icon: Bell, category: "Tools", desc: "Intelligent price alert dispatcher & threshold notifier" },
  { id: "admin", label: "🛡️ GMC Enterprise Security & Admin Control Panel", icon: ShieldAlert, category: "Admin", desc: "Enterprise security, user sessions & Telegram Bot control panel" },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeAssetKey,
  setActiveAssetKey,
  prices,
  isConnected,
  latencyMs,
  isLoggedIn,
  loggedInUser,
  onOpenLoginModal,
  onOpenHeatmapOverlay,
  onGoBack,
  onGoHome,
}) => {
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const currentAsset = SUPPORTED_ASSETS.find((a) => a.key === activeAssetKey) || SUPPORTED_ASSETS[0];
  const livePriceObj = prices[activeAssetKey] || { price: currentAsset.basePrice, changePct: 0.25 };

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (item.id === "admin") {
      return loggedInUser?.includes("Ahmed") || loggedInUser === "Ahmed";
    }
    return true;
  });

  const categories = ["ALL", "Core", "Signals", "AI Intelligence", "Market Data", "Analytics", "Tools", "News", "Admin"];

  const filteredNavItems = visibleNavItems.filter((item) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const activeItemLabel = NAV_ITEMS.find((i) => i.id === activeTab)?.label || "Dashboard";

  return (
    <header id="gmc-navbar" className="bg-[#0A0D12]/90 backdrop-blur-xl border-b border-white/10 text-slate-200 sticky top-0 z-50 shadow-2xl">
      {/* Top Utility & Status Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between text-xs gap-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          {/* Main GMC Navigation Drawer Toggle Button */}
          <button
            id="open-gmc-nav-drawer-btn"
            onClick={() => setIsNavDrawerOpen(!isNavDrawerOpen)}
            aria-label="Open GMC Navigation Tabs Drawer"
            className="px-3.5 py-1.5 bg-[#131821] hover:bg-[#1B2230] text-amber-300 border border-amber-500/40 rounded-xl font-mono font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
            title="Browse All 38+ GMC Navigation Tabs & AI Modules"
          >
            <LayoutGrid className="w-4 h-4 text-amber-400" />
            <span className="font-extrabold uppercase tracking-tight">GMC NAVIGATION TABS ({visibleNavItems.length})</span>
          </button>

          {/* Upper Header Back & Home Navigation Buttons */}
          <div className="flex items-center gap-2">
            {onGoBack && (
              <button
                id="header-nav-back-btn"
                onClick={onGoBack}
                className="flex items-center gap-1.5 px-3 py-1.5 btn-3d-gold btn-3d-tactile rounded-xl text-xs font-mono font-bold"
                title="Go Back"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {onGoHome && (
              <button
                id="header-nav-home-btn"
                onClick={onGoHome}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-mono font-bold btn-3d-tactile"
                title="Go Home (Vault)"
              >
                <Home className="w-3.5 h-3.5 text-amber-400" />
                <span>Home</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 rounded-xl flex items-center justify-center border border-amber-300/60 shadow-[0_0_15px_rgba(245,158,11,0.3)] shadow-amber-500/30">
              <span className="text-black font-black text-xs tracking-wider drop-shadow-sm">3D</span>
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-2 font-mono">
                🦇 BATMAN <span className="text-gradient-gold font-black">GMC 3D AI BRAIN</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Live Asset Selector Pills & Live Execution CTA */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar max-w-[200px] sm:max-w-none">
            {SUPPORTED_ASSETS.map((asset) => {
              const p = prices[asset.key] || { price: asset.basePrice, changePct: 0.1 };
              const isActive = asset.key === activeAssetKey;
              const pos = p.changePct >= 0;

              return (
                <button
                  key={asset.key}
                  id={`asset-pill-${asset.key}`}
                  onClick={() => setActiveAssetKey(asset.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 border whitespace-nowrap ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500/20 to-amber-700/20 text-white border-amber-500/80 shadow-[0_4px_12px_rgba(245,158,11,0.25)] font-bold"
                      : "bg-[#0A0E17] text-slate-400 border-slate-800/80 hover:text-slate-200 hover:bg-slate-900/80"
                  }`}
                >
                  <span className="font-bold text-slate-200">{asset.short}</span>
                  <span className="text-amber-300 font-extrabold">${p.price.toLocaleString()}</span>
                  <span className={`text-[10px] font-bold ${pos ? "text-emerald-400" : "text-rose-400"}`}>
                    {pos ? "+" : ""}{p.changePct}%
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={onOpenLoginModal}
            id="open-live-terminal-login-btn"
            className={`flex items-center gap-1.5 text-[11px] font-mono font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-lg uppercase tracking-wider ${
              isLoggedIn
                ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/60 hover:bg-emerald-600/40 shadow-emerald-600/20"
                : "btn-3d-gold active:scale-95"
            }`}
          >
            {isLoggedIn ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden xs:inline">VIP: {loggedInUser || "AHMED"}</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-white" />
                <span className="hidden xs:inline">3D TERMINAL</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Navigation Toolbar */}
      <div className="bg-[#05070E] border-b border-amber-500/20 px-3 py-1.5 overflow-x-auto no-scrollbar flex items-center gap-2 font-mono text-xs">
        <button
          onClick={() => setIsNavDrawerOpen(true)}
          className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
          <span>📂 BROWSE ALL MODULES ({visibleNavItems.length})</span>
        </button>

        <span className="text-slate-700">|</span>

        {/* Top Highlight Button for GMC GOLD */}
        <button
          id="quick-top-tool-gmcgold"
          onClick={() => setActiveTab("gmcgold")}
          className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all border whitespace-nowrap ${
            activeTab === "gmcgold"
              ? "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-105"
              : "bg-amber-500/10 text-amber-300 border-amber-500/40 hover:bg-amber-500/20"
          }`}
        >
          <Crown className="w-4 h-4 text-amber-950 fill-amber-300 animate-pulse" />
          <span>👑 GMC GOLD ZONE CARD</span>
        </button>

        {/* D3 Liquidity Heatmap Overlay Button */}
        <button
          id="quick-top-tool-d3heatmap-overlay"
          onClick={() => {
            if (onOpenHeatmapOverlay) {
              onOpenHeatmapOverlay();
            } else {
              setActiveTab("d3heatmap");
            }
          }}
          className="px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all border whitespace-nowrap bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25 shadow-md shadow-emerald-500/10"
        >
          <Flame className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>🔥 D3 HEATMAP OVERLAY</span>
        </button>

        <span className="text-slate-700">|</span>

        {/* Secondary Top Tools */}
        {visibleNavItems.slice(1, 7).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`top-quick-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap border flex items-center gap-1.5 ${
                isActive
                  ? "bg-blue-500/20 text-blue-300 border-blue-500/50"
                  : "bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              <Icon className="w-3 h-3 text-amber-400" />
              <span>{tab.label.split(" ")[1] || tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Sub-header for Mobile Quick Info */}
      <div className="md:hidden px-4 py-2 bg-[#06080C] border-b border-slate-800/60 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400">ACTIVE MODULE:</span>
        <button
          onClick={() => setIsNavDrawerOpen(true)}
          className="text-amber-300 font-bold flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-md"
        >
          <span>{activeItemLabel}</span>
          <LayoutGrid className="w-3.5 h-3.5 ml-1 text-amber-400" />
        </button>
      </div>

      {/* Primary Navigation Bar (Desktop Horizontal Strip) */}
      <div className="hidden md:flex max-w-7xl mx-auto px-4 items-center justify-between overflow-x-auto py-1.5 bg-[#080808]">
        <nav className="flex items-center gap-1 font-medium text-xs font-mono overflow-x-auto no-scrollbar py-1">
          {visibleNavItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all whitespace-nowrap border ${
                  isActive
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/30 font-bold shadow-sm"
                    : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-amber-400" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* FULL VERTICAL GMC NAVIGATION TABS DRAWER / MODAL (DESKTOP & MOBILE) */}
      {isNavDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-[#04060E]/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 font-mono text-xs animate-fade-in">
          <div className="relative w-full max-w-4xl bg-[#080B14] border-2 border-amber-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl text-slate-200 space-y-4 flex flex-col max-h-[90vh]">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 border border-amber-500/50 rounded-2xl flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                      GMC NAVIGATION TABS &amp; ALL MODULES
                    </h2>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                      {visibleNavItems.length} MODULES
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                    Browse and search through all available GMC AI trading tools, strategy engines &amp; analytics desks in one vertical view.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsNavDrawerOpen(false)}
                className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all cursor-pointer"
                title="Close Navigation Menu"
              >
                <X className="w-5 h-5 text-rose-400" />
              </button>
            </div>

            {/* Live Search Input Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all tools (e.g. Harami, D3 Heatmap, Gold, SMC, Vault, Admin)..."
                className="w-full bg-[#04060E] border-2 border-slate-800 focus:border-amber-500/80 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-2.5 text-slate-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px]">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-xl font-bold transition-all border whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-md"
                        : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    {cat === "ALL" ? `SHOW ALL (${visibleNavItems.length})` : cat}
                  </button>
                );
              })}
            </div>

            {/* COMPLETE VERTICAL MODULE LIST */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-1 text-left custom-scrollbar">
              {filteredNavItems.length === 0 ? (
                <div className="p-8 bg-[#04060E] border border-slate-800 rounded-2xl text-center space-y-2">
                  <p className="text-amber-400 font-bold">No modules matched your search filter "{searchQuery}"</p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("ALL");
                    }}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    Reset Search &amp; Show All Tools
                  </button>
                </div>
              ) : (
                filteredNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      id={`drawer-item-${item.id}`}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsNavDrawerOpen(false);
                      }}
                      className={`w-full p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left cursor-pointer group ${
                        isActive
                          ? "bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-amber-950/30 text-white border-amber-500/80 shadow-lg shadow-amber-500/10 scale-[1.005]"
                          : "bg-[#05070E] hover:bg-[#0A0E1A] text-slate-300 border-slate-800/80 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className={`p-2.5 rounded-xl border shrink-0 ${
                          isActive
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-md shadow-amber-500/20"
                            : "bg-slate-900 text-amber-400 border-slate-800 group-hover:border-amber-500/30"
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-xs sm:text-sm group-hover:text-amber-300 transition-colors">
                              {item.label}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-bold">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-sans mt-1 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 self-end sm:self-center">
                        {isActive ? (
                          <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/60 text-amber-300 font-bold text-[10px] flex items-center gap-1">
                            <span>ACTIVE MODULE</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 rounded-xl bg-slate-900 group-hover:bg-amber-500/20 border border-slate-800 group-hover:border-amber-500/40 text-slate-300 group-hover:text-amber-300 font-bold text-[10px] flex items-center gap-1 transition-all">
                            <span>LAUNCH MODULE</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-[10px] text-slate-500 font-sans gap-2">
              <span>Showing {filteredNavItems.length} of {visibleNavItems.length} available tools</span>
              <span className="text-amber-400 font-mono">💡 Click any tool to switch immediately without reloading</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
