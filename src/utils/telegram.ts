// Telegram Bot Signal Alert Dispatcher

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
  sendEntries: boolean;
  sendSLTPHits: boolean;
}

const STORAGE_KEY = "gmc_telegram_config";

export function getTelegramConfig(): TelegramConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Auto upgrade old expired tokens to current active bot token
      if (!parsed.botToken || parsed.botToken.trim() === "" || parsed.botToken.includes("8995493734")) {
        parsed.botToken = "8935835253:AAGWp1IeU9yA6wh2XmlcIE_W4ZAv4MIhA28";
      }
      if (!parsed.chatId || parsed.chatId.trim() === "") {
        parsed.chatId = "5218548758";
      }
      parsed.enabled = true;
      return parsed;
    }
  } catch (e) {
    console.error("Failed to load Telegram config", e);
  }
  const defaultConfig: TelegramConfig = {
    botToken: "8935835253:AAGWp1IeU9yA6wh2XmlcIE_W4ZAv4MIhA28",
    chatId: "5218548758",
    enabled: true,
    sendEntries: true,
    sendSLTPHits: true,
  };
  saveTelegramConfig(defaultConfig);
  return defaultConfig;
}

export function saveTelegramConfig(config: TelegramConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error("Failed to save Telegram config", e);
  }
}

// Track sent messages to prevent duplicates / spam
const sentAlertCache = new Set<string>();

export async function sendTelegramMessage(messageText: string, alertId?: string): Promise<{ success: boolean; message: string }> {
  const config = getTelegramConfig();

  if (!config.enabled || !config.botToken.trim() || !config.chatId.trim()) {
    return { success: false, message: "Telegram integration is disabled or credentials are missing." };
  }

  if (alertId) {
    if (sentAlertCache.has(alertId)) {
      return { success: true, message: "Alert already dispatched (duplicate suppressed)." };
    }
    sentAlertCache.add(alertId);
    // Limit cache size
    if (sentAlertCache.size > 200) {
      const first = sentAlertCache.values().next().value;
      if (first) sentAlertCache.delete(first);
    }
  }

  try {
    // 1. Try server endpoint first (bypasses browser CORS & adblockers)
    const response = await fetch("/api/telegram/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: messageText,
        botToken: config.botToken.trim(),
        chatId: config.chatId.trim(),
      }),
    });

    const data = await response.json();
    if (data.ok) {
      if (data.activeToken && data.activeToken !== config.botToken) {
        saveTelegramConfig({ ...config, botToken: data.activeToken });
      }
      return { success: true, message: "Telegram signal dispatched successfully!" };
    }

    // Direct browser fallback if server endpoint had non-ok status
    try {
      const activeToken = data.activeToken || config.botToken.trim();
      const directUrl = `https://api.telegram.org/bot${activeToken}/sendMessage`;
      const directRes = await fetch(directUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: config.chatId.trim(),
          text: messageText,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      });

      const directData = await directRes.json();
      if (directData.ok) {
        return { success: true, message: "Telegram signal dispatched via Direct API!" };
      }
    } catch (e) {
      // Ignore fallback error
    }

    return {
      success: false,
      message: data.error || "Failed to deliver message to Telegram. Please verify your Bot Token & Chat ID in Bot Settings.",
    };
  } catch (err: any) {
    return { success: false, message: err.message || "Network error sending message to Telegram." };
  }
}

export async function dispatchTradeAlertToTelegram(trade: {
  source: string;
  asset: string;
  type: "BUY" | "SELL";
  entry: number;
  sl: number;
  tp1: number;
  tp2?: number;
  tp3?: number;
  lotSize: number;
  confluence?: string;
  accountBalance?: number;
  totalPnL?: number;
}) {
  const alertId = `trade-${trade.source}-${trade.asset}-${trade.type}-${trade.entry}`;
  const icon = trade.type === "BUY" ? "🟢 🚀" : "🔴 📉";
  const balanceStr = trade.accountBalance ? `$${trade.accountBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$10,240.50";

  const message = `
<b>${icon} GMC TRADING AI SIGNAL ALERT</b>
━━━━━━━━━━━━━━━━━━━
<b>🧠 BRAIN MODULE:</b> ${trade.source}
<b>📊 ASSET:</b> ${trade.asset}
<b>🎯 DIRECTION:</b> <code>${trade.type}</code>
<b>📍 LIVE ENTRY:</b> <code>$${trade.entry.toFixed(2)}</code>
<b>🛑 STOP LOSS:</b> <code>$${trade.sl.toFixed(2)}</code>
<b>🎯 TAKE PROFIT 1:</b> <code>$${trade.tp1.toFixed(2)}</code>
${trade.tp2 ? `<b>🎯 TAKE PROFIT 2:</b> <code>$${trade.tp2.toFixed(2)}</code>\n` : ""}${trade.tp3 ? `<b>🎯 TAKE PROFIT 3:</b> <code>$${trade.tp3.toFixed(2)}</code>\n` : ""}<b>⚡ STRICT LOT SIZE:</b> <code>${(trade.lotSize || 0.01).toFixed(2)} LOT</code>
<b>💼 ACCOUNT BALANCE:</b> <code>${balanceStr}</code>
${trade.confluence ? `<b>🔥 CONFLUENCE:</b> ${trade.confluence}\n` : ""}━━━━━━━━━━━━━━━━━━━
<i>⚡ GMC AI Brain Auto-Dispatcher • Powered by Harami AI</i>
  `.trim();

  return await sendTelegramMessage(message, alertId);
}

export async function dispatchSLTPResultToTelegram(result: {
  source: string;
  asset: string;
  type: "BUY" | "SELL";
  outcome: "TP_HIT" | "SL_HIT";
  pnlUSD: number;
  price: number;
  accountBalance?: number;
}) {
  const alertId = `outcome-${result.source}-${result.asset}-${result.outcome}-${Math.round(result.price)}`;
  const isTP = result.outcome === "TP_HIT";
  const icon = isTP ? "🎉 💰" : "🛡️ 🛑";
  const balanceStr = result.accountBalance ? `$${result.accountBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$10,257.00";

  const message = `
<b>${icon} GMC TRADE OUTCOME NOTIFICATION</b>
━━━━━━━━━━━━━━━━━━━
<b>🧠 BRAIN MODULE:</b> ${result.source}
<b>📊 ASSET:</b> ${result.asset} (${result.type})
<b>STATUS:</b> <code>${isTP ? "✅ TAKE PROFIT HIT" : "❌ STOP LOSS HIT"}</code>
<b>EXIT PRICE:</b> <code>$${result.price.toFixed(2)}</code>
<b>NET PROFIT/LOSS:</b> <code>${result.pnlUSD >= 0 ? "+" : ""}$${result.pnlUSD.toFixed(2)}</code>
<b>💼 UPDATED BALANCE:</b> <code>${balanceStr}</code>
━━━━━━━━━━━━━━━━━━━
<i>⚡ GMC Risk Defense • Trade Closed Successfully</i>
  `.trim();

  return await sendTelegramMessage(message, alertId);
}
