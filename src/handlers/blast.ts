import { Api } from 'grammy';
import { GroupConfig, Objective } from '../config/groups';
import { templates } from '../content/templates';
import { getTodaysTournaments } from '../broadcasts/tournaments';

export async function sendManualBlast(api: Api, group: GroupConfig, objective: Objective) {
  const t = templates[group.market];
  const opts = { parse_mode: 'HTML' as const };

  switch (objective) {
    case 'registration':
      await api.sendMessage(group.chatId, t.registration, opts);
      break;

    case 'redirect':
      await api.sendMessage(group.chatId, t.redirect, opts);
      break;

    case 'tournaments': {
      const tournaments = await getTodaysTournaments();
      for (const tournament of tournaments.slice(0, 3)) {
        await api.sendMessage(group.chatId, t.tournaments(tournament), opts);
        await delay(1_500);
      }
      break;
    }
  }
}

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
