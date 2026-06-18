export type Market = 'kenya' | 'ethiopia';
export type GroupCategory = 'inhouse' | 'third_party';
export type Objective = 'registration' | 'tournaments' | 'redirect';
export type Language = 'en' | 'am';

export interface GroupConfig {
  chatId: string | number;
  name: string;
  market: Market;
  category: GroupCategory;
  language: Language;
  objectives: Objective[];
  /** How often (in minutes) to broadcast to this group */
  broadcastIntervalMinutes: number;
  /** Set false to temporarily pause this group without removing it */
  active: boolean;
}

export const GROUPS: GroupConfig[] = [
  // ── Category 1: Zuriplay Inhouse – Kenya ─────────────────────────────────
  {
    chatId: -1004150561039,
    name: 'Zuriplay Kenya Main',
    market: 'kenya',
    category: 'inhouse',
    language: 'en',
    objectives: ['registration', 'tournaments'],
    broadcastIntervalMinutes: 60,
    active: true,
  },

  // ── Category 2: 3rd Party groups (temporary access) ──────────────────────
  {
    chatId: '-100REPLACE_3P_GROUP_A',
    name: '3rd Party Group A',
    market: 'kenya',
    category: 'third_party',
    language: 'en',
    // redirect drives them to our own group; no deep tournament promos on 3rd party
    objectives: ['registration', 'redirect'],
    broadcastIntervalMinutes: 120, // less aggressive — we're guests here
    active: true,
  },

  // ── Category 3: Zuriplay Inhouse – Ethiopia ───────────────────────────────
  {
    chatId: '-100REPLACE_ET_INHOUSE',
    name: 'Zuriplay Ethiopia Main',
    market: 'ethiopia',
    category: 'inhouse',
    language: 'am',
    objectives: ['registration', 'tournaments'],
    broadcastIntervalMinutes: 60,
    active: true,
  },
];
