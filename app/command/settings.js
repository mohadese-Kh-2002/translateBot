import bot from "../bot.js";
import { LANGUAGES, userSettings } from "../db.js";

const settingsCommand=()=>{
    bot.onText(/\/settings/,(msg)=>{
        const chatId=msg.chat.id
        userSettings[chatId]={step:'change_lan_first'}
    
            const keyboard=Object.entries(LANGUAGES).filter(([code, word])=>code !=='auto').map(([code,word])=>[word])
            bot.sendMessage(chatId,'لطفا زبان مبدا خود را انتخاب کنید.',{
                reply_markup:{
                    keyboard,
                    resize_keyboard:true,
                    one_time_keyboard:true
                }
            })
        
        
    })
}
export default settingsCommand