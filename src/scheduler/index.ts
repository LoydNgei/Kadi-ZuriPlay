import cron from 'node-cron';
import { Bot } from 'grammy';
import { GROUPS, GroupConfig, Objective } from '../config/groups';
import { templates, TournamentData } from '../content/templates';
import { getTodaysTournaments } from '../broadcasts/tournaments';

// Tracks which groups are paused at runtime (via /pause command)
const pausedGroups = new Set<string | number>();

export function pauseGroup(chatId: string | number) {
  pausedGroups.add(chatId);
}

export function resumeGroup(chatId: string | number) {
  pausedGroups.delete(chatId);
}

export function isPaused(chatId: string | number) {
  return pausedGroups.has(chatId);
}

export function startScheduler(bot: Bot) {
  GROUPS.forEach((group) => {
    if (!group.active) return;

    // Interval broadcast — registration & redirect objectives
    const cronExpr = `*/${group.broadcastIntervalMinutes} * * * *`;
    cron.schedule(cronExpr, async () => {
      if (isPaused(group.chatId)) return;

      for (const objective of group.objectives) {
        if (objective === 'tournaments') continue; // handled by daily blast
        try {
          await sendObjective(bot, group, objective);
          await delay(3_000);
        } catch (err) {
          console.error(`[scheduler] Error sending ${objective} to ${group.name}:`, err);
        }
      }
    });

    console.log(`[scheduler] ${group.name} → every ${group.broadcastIntervalMinutes}m`);
  });

  // Daily tournament blast — 8:00 AM Nairobi time for all inhouse groups
  cron.schedule(
    '0 8 * * *',
    async () => {
      const tournaments = await getTodaysTournaments();
      if (!tournaments.length) {
        console.log('[scheduler] No tournaments today — skipping blast');
        return;
      }

      const inhouseGroups = GROUPS.filter(
        (g) => g.active && g.category === 'inhouse' && g.objectives.includes('tournaments'),
      );

      for (const group of inhouseGroups) {
        if (isPaused(group.chatId)) continue;
        try {
          await sendTournaments(bot, group, tournaments);
          await delay(3_000);
        } catch (err) {
          console.error(`[scheduler] Tournament blast failed for ${group.name}:`, err);
        }
      }
    },
    { timezone: 'Africa/Nairobi' },
  );

  console.log('[scheduler] Daily tournament blast scheduled at 08:00 Africa/Nairobi');
}

async function sendObjective(bot: Bot, group: GroupConfig, objective: Objective) {
  const t = templates[group.market];
  const opts = { parse_mode: 'HTML' as const };

  switch (objective) {
    case 'registration':
      await bot.api.sendMessage(group.chatId, t.registration, opts);
      break;
    case 'redirect':
      await bot.api.sendMessage(group.chatId, t.redirect, opts);
      break;
  }
}

async function sendTournaments(bot: Bot, group: GroupConfig, tournaments: TournamentData[]) {
  const t = templates[group.market];
  const opts = { parse_mode: 'HTML' as const };

  // Send top 3 tournaments max to avoid flooding
  for (const tournament of tournaments.slice(0, 3)) {
    await bot.api.sendMessage(group.chatId, t.tournaments(tournament), opts);
    await delay(1_500);
  }
}

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
