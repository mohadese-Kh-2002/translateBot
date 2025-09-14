import bot from "../bot.js";
import { LANGUAGES, userSettings } from "../db.js";
import {
  getUserInfo,
  saveUserSettings,
  textToSpeech,
} from "../../controllers.js";
import fs from "fs";
const callbackHandler = () => {
  bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    const settings = await getUserInfo(chatId);
    if (data.startsWith("change_lan")) {
      userSettings[chatId] = { step: "change_lan_first" };

      const keyboard = Object.entries(LANGUAGES)
        .filter(([code, word]) => code !== "auto")
        .map(([code, word]) => [word]);
      bot.sendMessage(chatId, "لطفا زبان مبدا خود را انتخاب کنید.", {
        reply_markup: {
          keyboard,
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
    }
    if (data.startsWith("copy_")) {
      const textToCopy = data.replace("copy_", "");

      bot.sendMessage(chatId, `📋 متن کپی شد:\n\n<code>${textToCopy}</code>`, {
        parse_mode: "HTML",
      });
      bot.answerCallbackQuery(query.id, { text: "✅ متن آماده کپی است" });
    }
    if (data.startsWith("tts_")) {
      const text = data.replace("tts_", "");
      const to = settings.to ? settings.to : settings["settings"].to;
      const path = await textToSpeech(text, to);
      await bot.sendAudio(chatId, path);
      fs.unlink(path, (err) => {
        if (err) console.error("❌ خطا در حذف فایل:", err);
        else console.log("🗑️ فایل پاک شد:", path);
      });
      return;
    }
    if (data === "swap") {
      await saveUserSettings(chatId, {
        from: settings.to ? settings.to : settings["settings"].to,
        to: settings.from ? settings.from : settings["settings"].from,
      });
      return bot.sendMessage(
        chatId,
        `🔄 زبان‌های مبدا و مقصد برعکس شد: ${
          LANGUAGES[settings.from ? settings.from : settings["settings"].from]
        } ➝ ${settings.to ? settings.to : settings["settings"].to}`
      );
    }
    if (data === "history") {
      const histories = Object.values(settings["tranlations"]);
      if (histories.length === 0) {
        return bot.sendMessage(
          chatId,
          "📭 هنوز ترجمه‌ای در تاریخچه شما ذخیره نشده است."
        );
      }

      const text = histories
        .map(
          (h) =>
            `📝 جمله وارد شده: ${h.orginal}\n` +
            `🌍 جمله ترجمه شده: ${h.translated}\n` +
            `📅 در تاریخ: ${new Date(h.date).toLocaleString("fa-IR")}\n`
        )
        .join("\n---------------------\n");

      return bot.sendMessage(chatId, `📜 تاریخچه شما:\n\n${text}`);
    }
  });
};
export default callbackHandler;
