import settingsCommand from "./command/settings.js";
import startCommand from "./command/start.js";
import callbackHandler from "./handlers/callbackHandler.js";
import messageHandler from "./handlers/messageHandler.js";
import { configDotenv } from "dotenv";



configDotenv()
startCommand()
messageHandler()
callbackHandler()
settingsCommand()


