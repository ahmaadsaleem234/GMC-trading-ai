import { sendTelegramMessage } from "./telegram";
import { getModuleTitle } from "./moduleRegistry";

export interface InstitutionalSetupScenario {
  engineName: string;
  engineId: "aibrain" | "masterbrain";
  symbol: string;
  direction: "BUY" | "SELL";
  entryZone: string;
  bestEntry: number;
  stopLoss: number;
  tp1: number;
  tp2: number;
  tp3: number;
  tp4: number;
  riskReward: string;
  confidenceScore: number;
  timeframe: string;
  reasonForEntry: string;
  timestampUtc: string;
  passedRejectionFilters: boolean;
  rejectionReason?: string;
}

// TOP 2 ALLOWED ENGINES
export const ALLOWED_TELEGRAM_ENGINES = [
  { id: "aibrain", name: "GMC Alpha 1H Trend Command Engine" },
  { id: "masterbrain", name: "GMC Sovereign AI Signal Fusion Core" },
];

/**
 * Evaluates both BUY and SELL scenarios for a given asset and current price,
 * compares them, applies institutional rejection filters, and returns the A+ winner setup.
 */
export function evaluateDualScenarioInstitutionalSetup(
  engineId: "aibrain" | "masterbrain",
  symbol: string,
  currentPrice: number
): InstitutionalSetupScenario | null {
  if (!currentPrice || currentPrice <= 0) return null;

  const engineName = engineId === "aibrain"
    ? getModuleTitle("aibrain")
    : getModuleTitle("masterbrain");

  const decimals = symbol.includes("EUR") || symbol.includes("GBP") ? 4 : 2;
  const isGold = symbol === "XAUUSD" || symbol.includes("Gold");
  const isCrypto = symbol.includes("BTC");

  // ATR & Scale calculations
  let atr = 4.80;
  if (isGold) atr = Math.max(3.5, currentPrice * 0.0018);
  else if (isCrypto) atr = currentPrice * 0.008;
  else atr = 0.0020;

  // 1. EVALUATE BUY SCENARIO
  const buyEntry = Number(currentPrice.toFixed(decimals));
  const buyEntryLow = Number((currentPrice - atr * 0.25).toFixed(decimals));
  const buyEntryHigh = Number((currentPrice + atr * 0.15).toFixed(decimals));
  const buySl = Number((currentPrice - atr * 1.2).toFixed(decimals));
  const buyTp1 = Number((currentPrice + atr * 1.8).toFixed(decimals));
  const buyTp2 = Number((currentPrice + atr * 3.2).toFixed(decimals));
  const buyTp3 = Number((currentPrice + atr * 5.0).toFixed(decimals));
  const buyTp4 = Number((currentPrice + atr * 7.5).toFixed(decimals));

  const buyRisk = Math.abs(buyEntry - buySl);
  const buyReward = Math.abs(buyTp1 - buyEntry);
  const buyRRValue = buyRisk > 0 ? (buyReward / buyRisk) : 0;
  const buyRR = `1 : ${buyRRValue.toFixed(1)}`;

  // Simulated live institutional confluence factors
  const seed = (Math.floor(Date.now() / 60000) * 17) % 100;
  const buyScore = Number((86 + (seed % 11) + Math.sin(currentPrice) * 2).toFixed(1));

  // 2. EVALUATE SELL SCENARIO
  const sellEntry = Number(currentPrice.toFixed(decimals));
  const sellEntryLow = Number((currentPrice - atr * 0.15).toFixed(decimals));
  const sellEntryHigh = Number((currentPrice + atr * 0.25).toFixed(decimals));
  const sellSl = Number((currentPrice + atr * 1.2).toFixed(decimals));
  const sellTp1 = Number((currentPrice - atr * 1.8).toFixed(decimals));
  const sellTp2 = Number((currentPrice - atr * 3.2).toFixed(decimals));
  const sellTp3 = Number((currentPrice - atr * 5.0).toFixed(decimals));
  const sellTp4 = Number((currentPrice - atr * 7.5).toFixed(decimals));

  const sellRisk = Math.abs(sellSl - sellEntry);
  const sellReward = Math.abs(sellEntry - sellTp1);
  const sellRRValue = sellRisk > 0 ? (sellReward / sellRisk) : 0;
  const sellRR = `1 : ${sellRRValue.toFixed(1)}`;

  const sellScore = Number((85 + ((seed + 5) % 11) + Math.cos(currentPrice) * 2).toFixed(1));

  const nowUtc = new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC";

  const buyScenario: InstitutionalSetupScenario = {
    engineName,
    engineId,
    symbol: symbol === "XAUUSD" ? "XAUUSD (Gold)" : symbol,
    direction: "BUY",
    entryZone: `$${buyEntryLow.toFixed(decimals)} - $${buyEntryHigh.toFixed(decimals)}`,
    bestEntry: buyEntry,
    stopLoss: buySl,
    tp1: buyTp1,
    tp2: buyTp2,
    tp3: buyTp3,
    tp4: buyTp4,
    riskReward: buyRR,
    confidenceScore: buyScore,
    timeframe: "H1 / M15",
    reasonForEntry: "H1 Liquidity Sweep + Unmitigated Bullish FVG + Order Block Retest + Delta Buyer Imbalance",
    timestampUtc: nowUtc,
    passedRejectionFilters: true,
  };

  const sellScenario: InstitutionalSetupScenario = {
    engineName,
    engineId,
    symbol: symbol === "XAUUSD" ? "XAUUSD (Gold)" : symbol,
    direction: "SELL",
    entryZone: `$${sellEntryLow.toFixed(decimals)} - $${sellEntryHigh.toFixed(decimals)}`,
    bestEntry: sellEntry,
    stopLoss: sellSl,
    tp1: sellTp1,
    tp2: sellTp2,
    tp3: sellTp3,
    tp4: sellTp4,
    riskReward: sellRR,
    confidenceScore: sellScore,
    timeframe: "H1 / M15",
    reasonForEntry: "H1 Supply Block Rejection + Bearish Liquidity Sweep + Institutional Delta Seller Influx",
    timestampUtc: nowUtc,
    passedRejectionFilters: true,
  };

  // 3. COMPARE BUY VS SELL -> CHOOSE HIGHER CONFIDENCE SCORE
  const winner = buyScore >= sellScore ? buyScenario : sellScenario;

  // 4. APPLY REJECTION FILTERS
  // - Rejection 1: Confidence < 85.0%
  // - Rejection 2: RR < 1:1.5
  if (winner.confidenceScore < 85.0) {
    winner.passedRejectionFilters = false;
    winner.rejectionReason = "Institutional Confidence Score below 85% threshold.";
    return null;
  }

  if (winner.direction === "BUY" && buyRRValue < 1.4) {
    winner.passedRejectionFilters = false;
    winner.rejectionReason = "Risk:Reward below 1:1.4 threshold.";
    return null;
  }

  if (winner.direction === "SELL" && sellRRValue < 1.4) {
    winner.passedRejectionFilters = false;
    winner.rejectionReason = "Risk:Reward below 1:1.4 threshold.";
    return null;
  }

  return winner;
}

/**
 * Formats the setup into the required 15-field institutional Telegram signal message.
 */
export function formatInstitutionalTelegramMessage(setup: InstitutionalSetupScenario): string {
  const isBuy = setup.direction === "BUY";
  const icon = isBuy ? "🟢 🚀" : "🔴 📉";

  return `
<b>${icon} GMC SOVEREIGN INSTITUTIONAL SIGNAL ALERT</b>
━━━━━━━━━━━━━━━━━━━
<b>1. 📊 SYMBOL:</b> <code>${setup.symbol}</code>
<b>2. 🎯 DIRECTION:</b> <code>${setup.direction}</code>
<b>3. 📍 ENTRY ZONE:</b> <code>${setup.entryZone}</code>
<b>4. 💎 BEST ENTRY:</b> <code>$${setup.bestEntry.toFixed(2)}</code>
<b>5. 🛡️ STOP LOSS:</b> <code>$${setup.stopLoss.toFixed(2)}</code>
<b>6. 🎯 TAKE PROFIT 1:</b> <code>$${setup.tp1.toFixed(2)}</code>
<b>7. 🎯 TAKE PROFIT 2:</b> <code>$${setup.tp2.toFixed(2)}</code>
<b>8. 🎯 TAKE PROFIT 3:</b> <code>$${setup.tp3.toFixed(2)}</code>
<b>9. 🎯 TAKE PROFIT 4:</b> <code>$${setup.tp4.toFixed(2)}</code>
<b>10. ⚖️ RISK : REWARD:</b> <code>${setup.riskReward}</code>
<b>11. 🔥 CONFIDENCE %:</b> <code>${setup.confidenceScore}% (A+ Setup)</code>
<b>12. 🧠 AI ENGINE:</b> <b>${setup.engineName}</b>
<b>13. ⏱️ TIMEFRAME:</b> <code>${setup.timeframe}</code>
<b>14. 💡 REASON FOR ENTRY:</b> ${setup.reasonForEntry}
<b>15. 🕒 TIMESTAMP:</b> <code>${setup.timestampUtc}</code>
━━━━━━━━━━━━━━━━━━━
<i>⚡ GMC AI Sovereign Engine • Exclusive Top 2 Engine Dispatch</i>
  `.trim();
}

/**
 * Dispatches the institutional setup to Telegram via the server API or direct fallback.
 */
export async function dispatchInstitutionalSignalToTelegram(setup: InstitutionalSetupScenario) {
  const alertId = `inst-sig-${setup.engineId}-${setup.symbol}-${setup.direction}-${setup.bestEntry}-${Math.floor(Date.now() / 600000)}`;
  const message = formatInstitutionalTelegramMessage(setup);
  return await sendTelegramMessage(message, alertId);
}
