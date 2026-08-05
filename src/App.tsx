import React, { useState, useEffect } from "react";
import { Navbar, NAV_ITEMS } from "./components/Navbar";
import { BlackSharkDashboard } from "./components/BlackSharkDashboard";
import { InteractiveChart } from "./components/InteractiveChart";
import { SniperEntry } from "./components/SniperEntry";
import { BacktesterView } from "./components/BacktesterView";
import { SignalScanner } from "./components/SignalScanner";
import { RiskCalculator } from "./components/RiskCalculator";
import { WhaleRadar } from "./components/WhaleRadar";
import { EconomicNews } from "./components/EconomicNews";
import { PriceAlerts } from "./components/PriceAlerts";
import { PerformanceMetricsView } from "./components/PerformanceMetricsView";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { WhatsAppChannelModal } from "./components/WhatsAppChannelModal";
import { BrainVaultGrid } from "./components/BrainVaultGrid";
import { Bond007View } from "./components/Bond007View";
import { MarketSentimentGauge } from "./components/MarketSentimentGauge";
import { LiquidityHeatmap } from "./components/LiquidityHeatmap";
import { ComparativeTerminal } from "./components/ComparativeTerminal";
import { MasterAIBrainSynthesizer } from "./components/MasterAIBrainSynthesizer";
import { CommandCenterView } from "./components/CommandCenterView";
import { LeoFusionView } from "./components/LeoFusionView";
import { DemoLeaderboardView } from "./components/DemoLeaderboardView";
import { InstitutionalHubView } from "./components/InstitutionalHubView";
import { LiveEquityTrackerView } from "./components/LiveEquityTrackerView";
import { HaramiAIView } from "./components/HaramiAIView";
import { GmcCap1HAIBrainView } from "./components/GmcCap1HAIBrainView";
import { GmcGoldZoneCardView } from "./components/GmcGoldZoneCardView";
import { InstitutionalLiquidityHeatmapD3 } from "./components/InstitutionalLiquidityHeatmapD3";
import { GmcLandingPage } from "./components/GmcLandingPage";
import { EnterpriseAccessModal } from "./components/EnterpriseAccessModal";
import { AIBrainJournalView } from "./components/AIBrainJournalView";
import { AdminDashboardView } from "./components/AdminDashboardView";
import { TabDemoBanner } from "./components/TabDemoBanner";
import { useDemoAccounts } from "./useDemoAccounts";
import { ArrowLeft, Home } from "lucide-react";
import {
  MTFDojiView,
  CipherView,
  NexusView,
  CandleEdgeView,
  SMCView,
  MomentumEdgeView,
  FalconView,
  AIBrainView,
  BrainsProView,
  SatoshiView,
  LiquidityMapView,
  MultiTFView,
  CryptoHubView,
  FundingPulseView,
  OrderPressureView,
  AINewsDeskView,
  PredictionEngineView,
  SignalHistoryView,
  SessionClockView,
  AIMasterEntryView,
} from "./components/ExtraViews";
import { LiveTerminalAuthModal } from "./components/LiveTerminalAuthModal";
import { TelegramBotModal } from "./components/TelegramBotModal";
import { QuickSwitchAssetStrip } from "./components/QuickSwitchAssetStrip";
import { RiskManagementCopilotModal } from "./components/RiskManagementCopilotModal";
import { TradeExecutionLog } from "./components/TradeExecutionLog";
import { sendTelegramMessage, dispatchTradeAlertToTelegram } from "./utils/telegram";
import { TradeLogEntry } from "./types";
import { useLiveData, useCandleData } from "./useLiveData";
import { useAutoTelegramBroadcaster } from "./useAutoTelegramBroadcaster";

const INITIAL_TRADES: TradeLogEntry[] = [
  {
    id: "trd-101",
    timestamp: "14:32:05",
    assetKey: "XAUUSD",
    type: "BUY",
    entryPrice: 3314.5,
    currentPrice: 3317.8,
    stopLoss: 3305.0,
    takeProfit: 3340.0,
    lotSize: 0.25,
    status: "TARGET_1_HIT",
    pnlUSD: 825.0,
    pnlPips: 33,
    signalSource: "BATMAN Master AI Brain",
  },
  {
    id: "trd-102",
    timestamp: "13:15:40",
    assetKey: "BTCUSD",
    type: "BUY",
    entryPrice: 94200.0,
    currentPrice: 95450.0,
    stopLoss: 93500.0,
    takeProfit: 96800.0,
    lotSize: 0.1,
    status: "IN_PROGRESS",
    pnlUSD: 1250.0,
    pnlPips: 125,
    signalSource: "BATMAN Black Shark DOM",
  },
  {
    id: "trd-103",
    timestamp: "11:04:12",
    assetKey: "EURUSD",
    type: "SELL",
    entryPrice: 1.0845,
    currentPrice: 1.0812,
    stopLoss: 1.088,
    takeProfit: 1.079,
    lotSize: 1.0,
    status: "TARGET_2_HIT",
    pnlUSD: 330.0,
    pnlPips: 33,
    signalSource: "BATMAN Bond 007 Command",
  },
  {
    id: "trd-104",
    timestamp: "09:45:00",
    assetKey: "GBPUSD",
    type: "BUY",
    entryPrice: 1.291,
    currentPrice: 1.2942,
    stopLoss: 1.287,
    takeProfit: 1.298,
    lotSize: 0.5,
    status: "CLOSED_PROFIT",
    pnlUSD: 160.0,
    pnlPips: 32,
    signalSource: "BATMAN LEO Fusion",
  },
  {
    id: "trd-105",
    timestamp: "08:12:18",
    assetKey: "US30",
    type: "SELL",
    entryPrice: 43850.0,
    currentPrice: 43840.0,
    stopLoss: 44000.0,
    takeProfit: 43500.0,
    lotSize: 0.05,
    status: "AI_GUARD_EXIT",
    pnlUSD: 50.0,
    pnlPips: 10,
    signalSource: "BATMAN Zone Reactor ML",
  },
];

export function App() {
  const [activeTab, setActiveTab] = useState<string>("landing");
  const [tabHistory, setTabHistory] = useState<string[]>([]);
  const [activeAssetKey, setActiveAssetKey] = useState<string>("XAUUSD");
  const [timeframe, setTimeframe] = useState<string>("15min");

  // Trade Journal Log & Copilot Modal State
  const [trades, setTrades] = useState<TradeLogEntry[]>(INITIAL_TRADES);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [copilotAssetKey, setCopilotAssetKey] = useState<string>("XAUUSD");
  const [copilotType, setCopilotType] = useState<"BUY" | "SELL">("BUY");

  // Terminal Auth & Enterprise Access State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isEnterpriseModalOpen, setIsEnterpriseModalOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  // Telegram Integration Modal State
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState<boolean>(false);

  // Institutional D3 Heatmap Overlay State
  const [isHeatmapOverlayOpen, setIsHeatmapOverlayOpen] = useState<boolean>(false);

  // WhatsApp Channel Timed Popup State (Once per visitor/session after 5-6 seconds)
  const [isWhatsAppChannelModalOpen, setIsWhatsAppChannelModalOpen] = useState<boolean>(false);

  // 30-Minute Inactivity Auto-Logout Tracker
  useEffect(() => {
    if (!isLoggedIn) return;

    let inactivityTimer: any;
    const INACTIVITY_LIMIT_MS = 30 * 60 * 1000; // 30 minutes

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        setIsLoggedIn(false);
        setLoggedInUser(null);
        setActiveTab("landing");
        setIsEnterpriseModalOpen(true);
      }, INACTIVITY_LIMIT_MS);
    };

    const activityEvents = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    activityEvents.forEach((ev) => window.addEventListener(ev, resetInactivityTimer));

    resetInactivityTimer();

    return () => {
      clearTimeout(inactivityTimer);
      activityEvents.forEach((ev) => window.removeEventListener(ev, resetInactivityTimer));
    };
  }, [isLoggedIn]);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("gmc_whatsapp_channel_popup_seen");
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsWhatsAppChannelModalOpen(true);
      }, 5500); // Wait 5.5 seconds after opening website
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseWhatsAppChannelModal = () => {
    sessionStorage.setItem("gmc_whatsapp_channel_popup_seen", "true");
    setIsWhatsAppChannelModalOpen(false);
  };

  // 🔴 STRICT REDIRECT TO LUXURY INSTITUTIONAL ENTERPRISE ACCESS SCREEN IF NOT AUTHENTICATED
  useEffect(() => {
    if (!isLoggedIn && activeTab !== "landing") {
      setActiveTab("landing");
      setIsEnterpriseModalOpen(true);
    }
  }, [isLoggedIn, activeTab]);

  const { prices, currentPrice, isConnected, latencyMs } = useLiveData(activeAssetKey);
  const { candles, loading } = useCandleData(activeAssetKey, timeframe);
  const { accounts, executeTabTrade, refillTabAccount, resetDemoAccounts } = useDemoAccounts();

  // Activate Hands-Free Automatic Telegram Trade Signal Broadcaster
  useAutoTelegramBroadcaster();

  // Send automatic session startup notification to Telegram
  useEffect(() => {
    const sentinel = sessionStorage.getItem("gmc_telegram_welcome_sent_v2");
    if (!sentinel) {
      sessionStorage.setItem("gmc_telegram_welcome_sent_v2", "true");
      sendTelegramMessage(
        `
<b>🟢 GMC AI BRAIN TELEGRAM BOT CONNECTED</b>
━━━━━━━━━━━━━━━━━━━
<b>STATUS:</b> <code>ONLINE & READY</code>
<b>BOT:</b> <code>@Gmctradingaibot</code>
<b>CHAT ID:</b> <code>5218548758</code>
<b>MODULES:</b> Harami AI, Master Brain, Bond 007, White Crow Radar
<b>STRICT LOT SIZE:</b> <code>0.01 LOT</code>

<i>⚡ Automated signal broadcasting is active! Any executed trade will post SL & TP details here automatically.</i>
        `.trim(),
        "welcome-session-init"
      );
    }
  }, []);

  const handleOpenRiskCopilot = (assetKey?: string, type?: "BUY" | "SELL") => {
    if (!isLoggedIn) {
      setIsEnterpriseModalOpen(true);
      return;
    }
    if (assetKey) setCopilotAssetKey(assetKey);
    if (type) setCopilotType(type);
    setIsCopilotOpen(true);
  };

  const handleExecuteTrade = (newTrade: Omit<TradeLogEntry, "id" | "timestamp">) => {
    const trade: TradeLogEntry = {
      ...newTrade,
      id: `trd-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
    };
    setTrades((prev) => [trade, ...prev]);
  };

  const handleCloseTrade = (tradeId: string) => {
    setTrades((prev) =>
      prev.map((t) => (t.id === tradeId ? { ...t, status: "CLOSED_PROFIT" as const } : t))
    );
  };

  const handleClearLog = () => {
    setTrades([]);
  };

  const handleSelectTab = (newTab: string) => {
    if (!isLoggedIn && newTab !== "landing") {
      setIsEnterpriseModalOpen(true);
      return;
    }
    // RBAC: Restrict Enterprise Admin Control Panel to Admin user (Ahmed)
    if (newTab === "admin" && (!loggedInUser?.includes("Ahmed") && loggedInUser !== "Ahmed")) {
      alert("Access Denied: GMC Enterprise Security & Admin Control Panel is strictly restricted to Super Admin (Ahmed).");
      return;
    }
    if (newTab !== activeTab) {
      setTabHistory((prev) => [...prev, activeTab]);
      setActiveTab(newTab);
    }
  };

  const handleGoBack = () => {
    if (tabHistory.length > 0) {
      const prevTab = tabHistory[tabHistory.length - 1];
      setTabHistory((prev) => prev.slice(0, prev.length - 1));
      setActiveTab(prevTab);
    } else {
      setActiveTab("vault");
    }
  };

  const handleGoHome = () => {
    if (activeTab !== "vault") {
      setTabHistory((prev) => [...prev, activeTab]);
      setActiveTab("vault");
    }
  };

  // 🔴 STRICT PUBLIC LANDING PAGE FOR GUEST VISITORS
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-3d-obsidian text-slate-300 font-sans flex flex-col selection:bg-amber-500 selection:text-black">
        {/* Enterprise Access Required Gate Modal */}
        <EnterpriseAccessModal
          isOpen={isEnterpriseModalOpen}
          onClose={() => setIsEnterpriseModalOpen(false)}
          onRequestWhatsApp={() => {
            window.open("https://chat.whatsapp.com/sample-gmc-trading-ai", "_blank");
          }}
          onOpenLogin={() => {
            setIsEnterpriseModalOpen(false);
            setIsLoginModalOpen(true);
          }}
        />

        {/* Live Terminal Authentication Modal */}
        <LiveTerminalAuthModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          isLoggedIn={isLoggedIn}
          loggedInUser={loggedInUser}
          onLoginSuccess={(username) => {
            setIsLoggedIn(true);
            setLoggedInUser(username);
            setActiveTab("gmcgold");
          }}
          onLogout={() => {
            setIsLoggedIn(false);
            setLoggedInUser(null);
          }}
          onContactWhatsApp={() => {
            window.open("https://chat.whatsapp.com/sample-gmc-trading-ai", "_blank");
          }}
        />

        {/* Institutional Marketing Landing Page (Strictly Public Website) */}
        <GmcLandingPage
          currentGoldPrice={currentPrice}
          onOpenLiveTerminal={() => {
            setIsEnterpriseModalOpen(true);
          }}
          onOpenWhatsApp={() => {
            window.open("https://chat.whatsapp.com/sample-gmc-trading-ai", "_blank");
          }}
          onOpenTelegram={() => {
            setIsEnterpriseModalOpen(true);
          }}
        />

        {/* Floating VIP WhatsApp Channel Link */}
        <WhatsAppButton />

        {/* Timed WhatsApp Channel VIP Promo Popup (5-6s delayed trigger) */}
        <WhatsAppChannelModal
          isOpen={isWhatsAppChannelModalOpen}
          onClose={handleCloseWhatsAppChannelModal}
        />
      </div>
    );
  }

  // 🟢 UNLOCKED PROFESSIONAL AI DASHBOARD FOR VERIFIED MEMBERS
  return (
    <div className="min-h-screen bg-3d-obsidian text-slate-300 font-sans flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Main Top Navigation & Ticker Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        activeAssetKey={activeAssetKey}
        setActiveAssetKey={setActiveAssetKey}
        prices={prices}
        isConnected={isConnected}
        latencyMs={latencyMs}
        isLoggedIn={isLoggedIn}
        loggedInUser={loggedInUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenHeatmapOverlay={() => setIsHeatmapOverlayOpen(true)}
        onGoBack={handleGoBack}
        onGoHome={handleGoHome}
      />

      {/* Live Terminal Authentication Modal */}
      <LiveTerminalAuthModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        isLoggedIn={isLoggedIn}
        loggedInUser={loggedInUser}
        onLoginSuccess={(username) => {
          setIsLoggedIn(true);
          setLoggedInUser(username);
        }}
        onLogout={() => {
          setIsLoggedIn(false);
          setLoggedInUser(null);
          setActiveTab("landing");
        }}
        onContactWhatsApp={() => {
          window.open("https://chat.whatsapp.com/sample-gmc-trading-ai", "_blank");
        }}
      />

      {/* Telegram Signal Bot Integration Modal */}
      <TelegramBotModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
      />

      {/* Floating Risk Management Copilot Modal */}
      <RiskManagementCopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        initialAssetKey={copilotAssetKey}
        initialType={copilotType}
        currentPrice={currentPrice}
        onExecuteTrade={handleExecuteTrade}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-4">
        {/* Quick-Switch Asset Monitoring Strip */}
        <QuickSwitchAssetStrip
          activeAssetKey={activeAssetKey}
          setActiveAssetKey={setActiveAssetKey}
          prices={prices}
          onOpenRiskCopilot={handleOpenRiskCopilot}
        />

        {/* Navigation Action Bar - Header Nav & Active Module Tracker */}
        <div className="flex flex-wrap items-center justify-between gap-3 card-3d-gold p-3 rounded-2xl shadow-2xl font-mono text-xs">
          <div className="flex items-center gap-2">
            <button
              id="global-nav-back-btn"
              onClick={handleGoBack}
              className="flex items-center gap-1.5 px-3.5 py-1.5 btn-3d-gold btn-3d-tactile rounded-xl font-bold text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              id="global-nav-home-btn"
              onClick={handleGoHome}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-amber-400 border border-amber-500/30 rounded-xl font-bold btn-3d-tactile text-xs"
            >
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleSelectTab("landing")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === "landing"
                  ? "bg-amber-500 text-slate-950 font-black shadow-[0_0_12px_rgba(245,179,1,0.4)]"
                  : "bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30"
              }`}
            >
              <span>🌐 Landing Portal</span>
            </button>

            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-amber-400/80 font-bold hidden sm:inline text-[11px] tracking-wider">3D AI BRAIN MATRIX</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTelegramModalOpen(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-sky-600/30 to-blue-600/30 hover:from-sky-600/40 hover:to-blue-600/40 text-sky-300 border border-sky-400/50 rounded-xl font-bold shadow-lg flex items-center gap-1.5 transition-all text-[11px]"
              title="Configure Telegram Bot Alerts"
            >
              <span>✈️ TELEGRAM BOT</span>
            </button>

            <span className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500/20 to-amber-700/20 border border-amber-500/60 text-amber-300 font-extrabold rounded-xl uppercase tracking-tight text-[11px] shadow-inner">
              {NAV_ITEMS.find((n) => n.id === activeTab)?.label || activeTab}
            </span>
          </div>
        </div>

        {activeTab === "landing" && (
          <GmcLandingPage
            currentGoldPrice={currentPrice}
            onOpenLiveTerminal={() => {
              if (!isLoggedIn) {
                setIsLoginModalOpen(true);
              } else {
                handleSelectTab("gmcgold");
              }
            }}
            onOpenWhatsApp={() => {
              window.open("https://chat.whatsapp.com/sample-gmc-trading-ai", "_blank");
            }}
            onOpenTelegram={() => {
              setIsTelegramModalOpen(true);
            }}
          />
        )}

        {activeTab === "gmcgold" && (
          <div className="space-y-4">
            <TabDemoBanner
              account={accounts["gmcgold"] || accounts["gmccap"]}
              onExecuteDemoTrade={() =>
                executeTabTrade("gmcgold", {
                  assetKey: activeAssetKey,
                  type: "BUY",
                  entryPrice: currentPrice,
                  stopLoss: currentPrice * 0.992,
                  takeProfit: currentPrice * 1.018,
                  lotSize: 0.1,
                  signalSource: "👑 GMC GOLD Zone Card & Bank Level AI Brain",
                })
              }
            />
            <GmcGoldZoneCardView
              currentPrice={currentPrice}
              assetKey={activeAssetKey}
              prices={prices}
              onOpenTradeCopilot={handleOpenRiskCopilot}
              onOpenHeatmapOverlay={() => setIsHeatmapOverlayOpen(true)}
            />
          </div>
        )}

        {activeTab === "d3heatmap" && (
          <InstitutionalLiquidityHeatmapD3
            currentPrice={currentPrice}
            assetKey={activeAssetKey}
            prices={prices}
            isOverlay={false}
          />
        )}

        {activeTab === "gmccap" && (
          <div className="space-y-4">
            <TabDemoBanner
              account={accounts["gmccap"]}
              onExecuteDemoTrade={() =>
                executeTabTrade("gmccap", {
                  assetKey: activeAssetKey,
                  type: "SELL",
                  entryPrice: currentPrice,
                  stopLoss: currentPrice * 1.004,
                  takeProfit: currentPrice * 0.994,
                  lotSize: 0.1,
                  signalSource: "👑 GMC CAP 1H AI Master Brain",
                })
              }
            />
            <GmcCap1HAIBrainView
              currentPrice={currentPrice}
              assetKey={activeAssetKey}
              prices={prices}
              onOpenRiskCopilot={handleOpenRiskCopilot}
              onExecuteCapTrade={(trade) => executeTabTrade("gmccap", trade)}
              onGoBack={handleGoBack}
              onGoHome={() => setActiveTab("vault")}
              trades={trades}
              account={accounts["gmccap"]}
            />
          </div>
        )}

        {activeTab === "harami" && (
          <div className="space-y-4">
            <TabDemoBanner
              account={accounts["harami"]}
              onExecuteDemoTrade={() =>
                executeTabTrade("harami", {
                  assetKey: activeAssetKey,
                  type: "BUY",
                  entryPrice: currentPrice,
                  stopLoss: currentPrice * 0.992,
                  takeProfit: currentPrice * 1.02,
                  lotSize: 0.01,
                  signalSource: "🥷 HARAMI AI MASTER SYNTHESIS",
                })
              }
            />
            <HaramiAIView
              currentPrice={currentPrice}
              assetKey={activeAssetKey}
              prices={prices}
              onOpenRiskCopilot={handleOpenRiskCopilot}
              onExecuteHaramiTrade={(trade) => executeTabTrade("harami", trade)}
              trades={trades}
            />
          </div>
        )}

        {activeTab === "admin" && (
          <AdminDashboardView
            isLoggedIn={isLoggedIn}
            loggedInUser={loggedInUser}
            onLogout={() => {
              setIsLoggedIn(false);
              setLoggedInUser(null);
              setActiveTab("landing");
            }}
            onForceLogoutUser={() => {
              setIsLoggedIn(false);
              setLoggedInUser(null);
              setActiveTab("landing");
            }}
          />
        )}

        {activeTab === "journal" && (
          <AIBrainJournalView
            accounts={accounts}
            onResetAllAccounts={resetDemoAccounts}
            onRefillTabAccount={refillTabAccount}
          />
        )}

        {activeTab === "demoleaderboard" && (
          <DemoLeaderboardView
            accounts={accounts}
            onExecuteDemoTrade={(tabId) =>
              executeTabTrade(tabId, {
                assetKey: activeAssetKey,
                type: "BUY",
                entryPrice: currentPrice,
                stopLoss: currentPrice * 0.992,
                takeProfit: currentPrice * 1.018,
              })
            }
            onResetAccounts={resetDemoAccounts}
            onSelectTab={handleSelectTab}
          />
        )}

        {activeTab === "institutional" && (
          <InstitutionalHubView
            currentPrice={currentPrice}
            assetKey={activeAssetKey}
            prices={prices}
            onOpenRiskCopilot={handleOpenRiskCopilot}
          />
        )}

        {activeTab === "equitytracker" && (
          <LiveEquityTrackerView trades={trades} />
        )}

        {activeTab === "vault" && (
          <BrainVaultGrid
            onSelectTab={handleSelectTab}
            isLoggedIn={isLoggedIn}
            loggedInUser={loggedInUser}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
          />
        )}

        {activeTab === "masterbrain" && (
          <div className="space-y-4">
            <TabDemoBanner
              account={accounts["masterbrain"]}
              onExecuteDemoTrade={() =>
                executeTabTrade("masterbrain", {
                  assetKey: activeAssetKey,
                  type: "BUY",
                  entryPrice: currentPrice,
                  stopLoss: currentPrice * 0.992,
                  takeProfit: currentPrice * 1.02,
                })
              }
            />
            <MasterAIBrainSynthesizer
              currentPrice={currentPrice}
              activeAssetKey={activeAssetKey}
              setActiveAssetKey={setActiveAssetKey}
              prices={prices}
              onSelectTab={handleSelectTab}
              onOpenRiskCopilot={handleOpenRiskCopilot}
              trades={trades}
              onCloseTrade={handleCloseTrade}
              onClearLog={handleClearLog}
            />
          </div>
        )}

        {activeTab === "tradelog" && (
          <TradeExecutionLog
            trades={trades}
            onCloseTrade={handleCloseTrade}
            onClearLog={handleClearLog}
            onOpenRiskCopilot={handleOpenRiskCopilot}
          />
        )}

        {activeTab === "bond007" && (
          <Bond007View
            currentPrice={currentPrice}
            candles={candles}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
            activeAssetKey={activeAssetKey}
          />
        )}

        {activeTab === "sentiment" && (
          <MarketSentimentGauge
            currentPrice={currentPrice}
            assetKey={activeAssetKey}
            prices={prices}
          />
        )}

        {activeTab === "heatmap" && (
          <LiquidityHeatmap
            currentPrice={currentPrice}
            assetKey={activeAssetKey}
            prices={prices}
          />
        )}

        {activeTab === "comparative" && (
          <ComparativeTerminal
            currentPrice={currentPrice}
            candles={candles}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
            activeAssetKey={activeAssetKey}
            prices={prices}
          />
        )}

        {activeTab === "blackshark" && (
          <BlackSharkDashboard currentPrice={currentPrice} assetKey={activeAssetKey} prices={prices} />
        )}

        {activeTab === "metrics" && (
          <PerformanceMetricsView />
        )}

        {activeTab === "chart" && (
          <InteractiveChart
            candles={candles}
            activeAssetKey={activeAssetKey}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
            currentPrice={currentPrice}
          />
        )}

        {activeTab === "sniper" && (
          <SniperEntry
            candles={candles}
            currentPrice={currentPrice}
            activeAssetKey={activeAssetKey}
          />
        )}

        {activeTab === "aimaster" && (
          <div className="space-y-4">
            <TabDemoBanner
              account={accounts["aimaster"]}
              onExecuteDemoTrade={() =>
                executeTabTrade("aimaster", {
                  assetKey: activeAssetKey,
                  type: "BUY",
                  entryPrice: currentPrice,
                  stopLoss: currentPrice * 0.992,
                  takeProfit: currentPrice * 1.02,
                })
              }
            />
            <LeoFusionView
              currentPrice={currentPrice}
              assetKey={activeAssetKey}
              prices={prices}
              onOpenRiskCopilot={handleOpenRiskCopilot}
              trades={trades}
            />
          </div>
        )}

        {activeTab === "nexus" && (
          <div className="space-y-4">
            <TabDemoBanner
              account={accounts["nexus"]}
              onExecuteDemoTrade={() =>
                executeTabTrade("nexus", {
                  assetKey: activeAssetKey,
                  type: "BUY",
                  entryPrice: currentPrice,
                  stopLoss: currentPrice * 0.992,
                  takeProfit: currentPrice * 1.02,
                })
              }
            />
            <CommandCenterView
              currentPrice={currentPrice}
              assetKey={activeAssetKey}
              prices={prices}
              onOpenRiskCopilot={handleOpenRiskCopilot}
              trades={trades}
            />
          </div>
        )}

        {activeTab === "mtfdoji" && (
          <MTFDojiView currentPrice={currentPrice} assetKey={activeAssetKey} />
        )}

        {activeTab === "cipher" && (
          <CipherView currentPrice={currentPrice} assetKey={activeAssetKey} />
        )}

        {activeTab === "doji" && (
          <CandleEdgeView currentPrice={currentPrice} assetKey={activeAssetKey} />
        )}

        {activeTab === "smc" && (
          <SMCView currentPrice={currentPrice} assetKey={activeAssetKey} />
        )}

        {activeTab === "breakout" && (
          <MomentumEdgeView currentPrice={currentPrice} assetKey={activeAssetKey} />
        )}

        {activeTab === "falcon" && (
          <FalconView currentPrice={currentPrice} assetKey={activeAssetKey} />
        )}

        {activeTab === "aibrain" && (
          <AIBrainView currentPrice={currentPrice} assetKey={activeAssetKey} />
        )}

        {activeTab === "brainspro" && (
          <div className="space-y-4">
            <TabDemoBanner
              account={accounts["brainspro"]}
              onExecuteDemoTrade={() =>
                executeTabTrade("brainspro", {
                  assetKey: activeAssetKey,
                  type: "BUY",
                  entryPrice: currentPrice,
                  stopLoss: currentPrice * 0.992,
                  takeProfit: currentPrice * 1.02,
                  lotSize: 0.01,
                  signalSource: "⛓️ Chains AI Reasoning",
                })
              }
            />
            <BrainsProView currentPrice={currentPrice} assetKey={activeAssetKey} />
          </div>
        )}

        {activeTab === "satoshi" && (
          <SatoshiView currentPrice={currentPrice} assetKey={activeAssetKey} />
        )}

        {activeTab === "liquidity" && (
          <LiquidityMapView currentPrice={currentPrice} assetKey={activeAssetKey} />
        )}

        {activeTab === "multitf" && (
          <MultiTFView currentPrice={currentPrice} assetKey={activeAssetKey} />
        )}

        {activeTab === "pressure" && (
          <OrderPressureView />
        )}

        {activeTab === "crypto" && (
          <CryptoHubView prices={prices} />
        )}

        {activeTab === "funding" && (
          <FundingPulseView />
        )}

        {activeTab === "sessionclock" && (
          <SessionClockView />
        )}

        {activeTab === "backtest" && (
          <BacktesterView activeAssetKey={activeAssetKey} currentPrice={currentPrice} />
        )}

        {activeTab === "scanner" && (
          <SignalScanner
            prices={prices}
            onSelectAsset={(key) => {
              setActiveAssetKey(key);
              setActiveTab("sniper");
            }}
          />
        )}

        {activeTab === "whale" && (
          <div className="space-y-4">
            <TabDemoBanner
              account={accounts["whale"]}
              onExecuteDemoTrade={() =>
                executeTabTrade("whale", {
                  assetKey: activeAssetKey,
                  type: "BUY",
                  entryPrice: currentPrice,
                  stopLoss: currentPrice * 0.992,
                  takeProfit: currentPrice * 1.02,
                  lotSize: 0.01,
                  signalSource: "🦅 White Crow Radar",
                })
              }
            />
            <WhaleRadar
              currentPrice={currentPrice}
              assetKey={activeAssetKey}
              prices={prices}
              onExecuteDemoTrade={() =>
                executeTabTrade("whale", {
                  assetKey: activeAssetKey,
                  type: "BUY",
                  entryPrice: currentPrice,
                  stopLoss: currentPrice * 0.992,
                  takeProfit: currentPrice * 1.02,
                  lotSize: 0.01,
                  signalSource: "🦅 White Crow Radar",
                })
              }
            />
          </div>
        )}

        {activeTab === "history" && (
          <SignalHistoryView currentPrice={currentPrice} assetKey={activeAssetKey} />
        )}

        {activeTab === "news" && (
          <EconomicNews />
        )}

        {activeTab === "ainews" && (
          <AINewsDeskView />
        )}

        {activeTab === "prediction" && (
          <PredictionEngineView />
        )}

        {activeTab === "risk" && (
          <RiskCalculator currentPrice={currentPrice} />
        )}

        {activeTab === "alerts" && (
          <PriceAlerts prices={prices} activeAssetKey={activeAssetKey} />
        )}
      </main>

      {/* Institutional Footer & Risk Disclosure */}
      <footer className="bg-[#050505] border-t border-slate-800 py-4 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white tracking-tight">GMC TRADING <span className="text-blue-500">DASHBOARD</span></span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest border-l border-slate-800 pl-3">Black Shark Command V1</span>
            <p className="text-[11px] text-slate-500 hidden md:block">
              Institutional algorithmic signal execution engine, orderbook DOM flow, and risk control.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[10px] uppercase font-mono tracking-wider">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_6px_rgba(34,197,94,0.6)]"></span>
              <span className="text-slate-400">STATE_SYNC: LOCKED</span>
            </div>
            <div className="text-slate-600">INTERNAL_SECURE_ENV</div>
          </div>
        </div>
      </footer>

      {/* D3 Institutional Liquidity Heatmap Full Overlay Modal */}
      {isHeatmapOverlayOpen && (
        <InstitutionalLiquidityHeatmapD3
          currentPrice={currentPrice}
          assetKey={activeAssetKey}
          prices={prices}
          isOverlay={true}
          onCloseOverlay={() => setIsHeatmapOverlayOpen(false)}
        />
      )}

      {/* Floating VIP WhatsApp Channel Link */}
      <WhatsAppButton />

      {/* Telegram Bot Integration Modal (Admin-Only RBAC Protected) */}
      <TelegramBotModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
        loggedInUser={loggedInUser}
      />

      {/* Timed WhatsApp Channel VIP Promo Popup (5-6s delayed trigger) */}
      <WhatsAppChannelModal
        isOpen={isWhatsAppChannelModalOpen}
        onClose={handleCloseWhatsAppChannelModal}
      />
    </div>
  );
}

export default App;
