import TelegramBot from "node-telegram-bot-api";

import dotenv from "dotenv";

dotenv.config();

const bot = new TelegramBot(process.env.TOKEN, {
  polling: {
    interval: 300,
    timeout: 30,
    limit: 100,
    retryTimeout: 5000,
    allowedUpdates: [
      "message",
      "callback_query",
      "edited_message",
      "channel_post",
      "edited_channel_post",
    ],
  },
});
export default bot;
