import bot from "../bot.js";
import { LANGUAGES, userSettings } from "../db.js";
import {
  getUserInfo,
  saveTranslation,
  saveUserSettings,
  textToSpeech,
  translateText,
} from "../../controllers.js";
const messageHandler = () => {
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (!text || text.startsWith("/")) return;

    if (userSettings[chatId]) {
      const step = userSettings[chatId].step;

      if (step === "change_lan_first") {
        const from = Object.keys(LANGUAGES).find(
          (code) => LANGUAGES[code] === text
        );
        if (!from) return;
        userSettings[chatId].from = from;
        userSettings[chatId].step = "change_lan_second";

        const keyboard = Object.entries(LANGUAGES)
          .filter(([code, word]) => code !== "auto")
          .map(([code, word]) => [word]);
        bot.sendMessage(chatId, "حالا زبان مقصد خود را انتخاب کنید:", {
          reply_markup: {
            keyboard,
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        });
        return;
      }

      if (step === "change_lan_second") {
        const to = Object.keys(LANGUAGES).find(
          (code) => LANGUAGES[code] === text
        );
        if (!to) return;

        userSettings[chatId].to = to;
        const { from } = userSettings[chatId];
        await saveUserSettings(chatId, { from, to });

        bot.sendMessage(
          chatId,
          `✅ تنظیمات ذخیره شد:\n${LANGUAGES[from]}---> ${LANGUAGES[to]}`,
          { reply_markup: { remove_keyboard: true } }
        );

        delete userSettings[chatId];
        return;
      }
    }
    if (text === "تاریخچه ترجمه من") {
      console.log("");
    }
    const settings = await getUserInfo(chatId);
    const translated = await translateText(
      text,
      settings.from ? settings.from : settings["settings"].from,
      settings.to ? settings.to : settings["settings"].to
    );
    await saveTranslation(chatId, text, translated);
    bot.sendMessage(
      chatId,
      `🌍 ترجمه از ${
        LANGUAGES[
          `${settings.from ? settings.from : settings["settings"].from}`
        ]
      } به ${
        LANGUAGES[`${settings.to ? settings.to : settings["settings"].to}`]
      }:\n\n${translated}`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "تغییر زبان مبدا و مقصد", callback_data: "change_lan" }],
            [{text:"دیدن تاریخچه ترجمه من",callback_data:'history'}],
            [
              { text: "🔄 Swap", callback_data: "swap" },
               { text: "🔊 شنیدن", callback_data: `tts_${translated}` },
              { text: "📋 کپی", callback_data: `copy_${translated}` },
            ]
          ],
      
        },
      }
    );
  });
};
export default messageHandler;
