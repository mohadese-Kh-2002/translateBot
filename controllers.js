import { translate } from "@vitalets/google-translate-api";
import { db, ref, set, get, child, push } from "./firebase.js";
import { franc } from "franc";
import gTTS from "gtts";
import iso6393to1 from "iso-639-3-to-1";
import { LANGUAGES } from "./app/db.js";
const SUPPORTED_LANGS = [
  "af","ar","bn","bs","ca","cs","cy","da","de","el","en","en-us","en-uk","es","es-es","es-us",
  "et","fi","fr","gu","hi","hr","hu","id","is","it","iw","ja","jw","km","kn","ko","la","lv","mk",
  "ml","mr","my","ne","nl","no","pl","pt","pt-br","pt-pt","ro","ru","si","sk","sq","sr","su",
  "sv","sw","ta","te","th","tl","tr","uk","ur","vi","zh-CN","zh-TW"
];
const dbRef = ref(db);
export const getUserInfo = async (userId) => {
  const snapshot = await get(child(dbRef, `users/${userId}`));
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return { from: "auto", to: "en" };
};
export const saveUserSettings = async (userId, settings) => {
  await set(ref(db, `users/${userId}/settings`), settings);
};
export const saveTranslation = async (userId, orginal, translated) => {
  await push(ref(db,`users/${userId}/tranlations`), {
    orginal,
    translated,
    date: Date.now(),
  });
};
export const translateText = async (text, from, to) => {
  try {
    if (from === "auto") {
      const detectedLang3 = franc(text);
      console.log("franc →", detectedLang3);

      let detectedLang = "en"; 
      if (detectedLang3 !== "und") {
        const converted = iso6393to1(detectedLang3);
        if (converted) detectedLang = converted;
      }
      from = Object.keys(LANGUAGES).includes(detectedLang)
        ? detectedLang
        : "en";

      console.log(`تشخیص زبان: ${detectedLang3} → ${from}`);
    }
    const res = await translate(text, { from, to });
    return res.text;
  } catch (err) {
    console.error("❌ Translation Error:", err.message);
  }
};
export const textToSpeech = (text, lang = "en") => {
  return new Promise((resolve, reject) => {
      if (!SUPPORTED_LANGS.includes(lang)) {
      console.warn(`⚠️ زبان "${lang}" پشتیبانی نمی‌شود. پیش‌فرض: en`);
      lang = "en";
    }
    try {
      const tts = new gTTS(text, lang);
      const path = `./app/audio/temp_${Date.now()}.mp3`;
      tts.save(path, (err) => {
        if (err) reject(err);
        else resolve(path);
      });
    } catch (err) {
      reject(err);
    }
    
  });
};
