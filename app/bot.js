import TelegramBot from "node-telegram-bot-api";

import dotenv from "dotenv";

dotenv.config();

const bot = new TelegramBot(process.env.TOKEN, {
  polling: {
    params: {
      timeout: 30,
      limit: 100,
     allowed_updates: [
        "message",
        "callback_query",
        "edited_message",
        "channel_post",
        "edited_channel_post",
      ]
    },
  },
});
bot.deleteWebHook().then(() => {
  console.log("Webhook deleted, polling started...");
});

export default bot;
