import { getUserInfo } from "../../controllers.js";
import bot from "../bot.js";


const startCommand = () => {
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const settings = await getUserInfo(chatId);
    bot.sendMessage(
      chatId,
      `سلام ${
        msg.from.first_name
      } 👋\nمن یک ربات مترجم حرفه‌ای هستم 🌍\n\n🔄 زبان پیش‌فرض: ${
        settings.from ? settings.from : settings["settings"].from
      } ➝ ${
        settings.to ? settings.to : settings["settings"].to
      }\n\nبرای تغییر زبان دستور زیر رو بزن:\n/settings`
   );
  });
};
export default startCommand;
