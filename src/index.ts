import 'dotenv/config';
import { Bot } from 'grammy';
import { startScheduler } from './scheduler';
import { registerCommands } from './handlers/commands';

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('BOT_TOKEN is not set in .env');

const bot = new Bot(token);

registerCommands(bot);
startScheduler(bot);

bot.catch((err) => {
  console.error('[bot] Unhandled error:', err.message);
});

bot.start({
  onStart: () => console.log('[bot] Zuriplay Bot is running 🚀'),
});
