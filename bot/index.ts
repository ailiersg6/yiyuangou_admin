import dotenv from "dotenv";
import { Bot, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";

// import {
//   startPaymentProcess,
//   checkTransaction,
// } from "./bot/handlers/payment.js";
// import handleStart from "./bot/handlers/start.js";
const bot = new Bot(process.env.BOT_TOKEN!);