import TelegramBot from "node-telegram-bot-api";
import dotenv from 'dotenv'
dotenv.config()
const bot=new TelegramBot(process.env.TOKEN,{polling:true})
export default bot