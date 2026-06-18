import { TournamentData } from '../content/templates';

// When TOURNAMENTS_API_URL is set, fetches live data.
// Otherwise returns whatever was last set via the /tournament admin command.
let manualTournaments: TournamentData[] = [];

export function setManualTournaments(data: TournamentData[]) {
  manualTournaments = data;
}

export async function getTodaysTournaments(): Promise<TournamentData[]> {
  const apiUrl = process.env.TOURNAMENTS_API_URL;
  if (!apiUrl) return manualTournaments;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.TOURNAMENTS_API_KEY ?? ''}`,
      },
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const json = (await res.json()) as { tournaments?: TournamentData[] };
    return json.tournaments ?? [];
  } catch (err) {
    console.error('[tournaments] fetch failed, falling back to manual:', err);
    return manualTournaments;
  }
}
