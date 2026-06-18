import { Bot, Context } from 'grammy';
import { GROUPS } from '../config/groups';
import { pauseGroup, resumeGroup, isPaused } from '../scheduler';
import { setManualTournaments } from '../broadcasts/tournaments';

function isAdmin(ctx: Context): boolean {
  const adminId = process.env.ADMIN_CHAT_ID;
  if (!adminId) return false;
  return String(ctx.from?.id) === adminId;
}

export function registerCommands(bot: Bot) {
  // ── Public commands ───────────────────────────────────────────────────────

  bot.command('start', (ctx) =>
    ctx.reply(
      'Zuriplay Bot is running. Register at https://zuriplay.bet 🎯',
    ),
  );

  // ── Admin commands (private chat only, admin ID must match) ───────────────

  bot.command('status', (ctx) => {
    if (!isAdmin(ctx)) return;

    const lines = GROUPS.map((g) => {
      const state = !g.active ? '🔴 disabled' : isPaused(g.chatId) ? '⏸ paused' : '🟢 active';
      return `${state} — ${g.name} (every ${g.broadcastIntervalMinutes}m)`;
    });

    ctx.reply(`*Bot Status*\n\n${lines.join('\n')}`, { parse_mode: 'Markdown' });
  });

  // /pause <chatId>  — pause broadcasts to a specific group
  bot.command('pause', (ctx) => {
    if (!isAdmin(ctx)) return;
    const chatId = ctx.match?.trim();
    if (!chatId) return ctx.reply('Usage: /pause <chatId>');

    pauseGroup(chatId);
    ctx.reply(`⏸ Broadcasts paused for ${chatId}`);
  });

  // /resume <chatId>  — resume broadcasts to a specific group
  bot.command('resume', (ctx) => {
    if (!isAdmin(ctx)) return;
    const chatId = ctx.match?.trim();
    if (!chatId) return ctx.reply('Usage: /resume <chatId>');

    resumeGroup(chatId);
    ctx.reply(`▶️ Broadcasts resumed for ${chatId}`);
  });

  // /tournament <name> | <prize> | <deadline> [| <link>]
  // Manually sets today's tournament when no API is configured.
  // Example: /tournament Premier League | KES 50,000 | 8PM EAT | https://zuriplay.bet/t/123
  bot.command('tournament', (ctx) => {
    if (!isAdmin(ctx)) return;

    const raw = ctx.match?.trim() ?? '';
    const parts = raw.split('|').map((s) => s.trim());

    if (parts.length < 3) {
      return ctx.reply('Usage: /tournament <name> | <prize> | <deadline> [| <link>]');
    }

    const [name, prize, deadline, link] = parts;
    setManualTournaments([{ name, prize, deadline, link }]);

    ctx.reply(`✅ Tournament set:\n*${name}*\nPrize: ${prize}\nDeadline: ${deadline}`, {
      parse_mode: 'Markdown',
    });
  });

  // /blast <chatId> <objective>  — send a one-off message immediately
  bot.command('blast', async (ctx) => {
    if (!isAdmin(ctx)) return;

    const [chatId, objective] = (ctx.match?.trim() ?? '').split(' ');
    if (!chatId || !objective) {
      return ctx.reply('Usage: /blast <chatId> registration|tournaments|redirect');
    }

    const group = GROUPS.find((g) => String(g.chatId) === chatId);
    if (!group) return ctx.reply(`Group ${chatId} not found in config`);

    // Dynamically import to avoid circular dependency
    const { sendManualBlast } = await import('./blast');
    await sendManualBlast(ctx.api, group, objective as any);
    ctx.reply(`✅ Blast sent to ${group.name}`);
  });
}
