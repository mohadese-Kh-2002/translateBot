import { translate } from "@vitalets/google-translate-api";

export function handleTranslate(chatId, text, replyToId = null) {
  const { from, to } = userSettings[chatId] || { from: "auto", to: "fa" };

  translate(text, { from, to })
    .then((res) => {
      const detectedLang = res.from.language.iso;
      bot.sendMessage(
        chatId,
        `📌 متن اصلی (${LANGUAGES[detectedLang] || detectedLang}):\n${text}\n\n🌍 ترجمه (${LANGUAGES[from]} ➝ ${LANGUAGES[to]}):\n${res.text}`,
        { reply_to_message_id: replyToId || undefined }
      );
    }).catch((err) => {
      console.error(err);
      bot.sendMessage(chatId, "❌ خطا در ترجمه. دوباره امتحان کنید.");
    });
}