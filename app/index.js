import settingsCommand from "./command/settings.js";
import startCommand from "./command/start.js";
import callbackHandler from "./handlers/callbackHandler.js";
import messageHandler from "./handlers/messageHandler.js";
import { configDotenv } from "dotenv";
import e from "express";
import cors from 'cors'
import bot from "./bot.js";
const app=e()
app.use(cors())
app.use(e.json());
configDotenv()
// app.post(`/bot${process.env.TOKEN}`, async(req, res) => {
//     console.log(req.body);
//    const info=await bot.getWebHookInfo();
//    console.log(info);
//   bot.processUpdate(req.body);
//   res.sendStatus(200);
// });
startCommand()
messageHandler()
callbackHandler()
settingsCommand()
app.listen(3000,async()=>{
     console.log("🚀 Bot server is running...");
    await bot.deleteWebHook();
})