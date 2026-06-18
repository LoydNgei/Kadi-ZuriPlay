import { Market } from '../config/groups';

const BASE = process.env.ZURIPLAY_BASE_URL ?? 'https://zuriplay.bet';
const KE_GROUP = process.env.ZURIPLAY_KE_GROUP_LINK ?? 'https://t.me/zuriplay_kenya';
const ET_GROUP = process.env.ZURIPLAY_ET_GROUP_LINK ?? 'https://t.me/zuriplay_ethiopia';

export interface TournamentData {
  name: string;
  prize: string;
  deadline: string;
  link?: string;
}

type MarketTemplates = {
  registration: string;
  tournaments: (t: TournamentData) => string;
  redirect: string;
};

export const templates: Record<Market, MarketTemplates> = {
  kenya: {
    registration: `
🎯 <b>Ready to WIN BIG?</b>

Join thousands of Kenyans already predicting &amp; winning on <b>Zuriplay</b>!

✅ Register in 2 minutes
🎁 Welcome bonus on first deposit
💸 Fast M-Pesa withdrawals
🏆 Daily tournaments with cash prizes

👉 <a href="${BASE}/register?ref=tg_ke">Register Now</a>
📲 <a href="${BASE}/refer?ref=tg_ke">Refer &amp; Earn</a>
💡 <a href="${BASE}/how-it-works">Learn How It Works</a>
    `.trim(),

    tournaments: ({ name, prize, deadline, link }) => `
🏆 <b>TODAY'S TOURNAMENT</b>

<b>${name}</b>
💰 Prize Pool: <b>${prize}</b>
⏰ Close: ${deadline}

Make your predictions before time runs out!

👉 <a href="${link ?? `${BASE}/tournaments?ref=tg_ke`}">Join Tournament</a>
📲 <a href="${BASE}/register?ref=tg_ke_tour">Register Free</a>
    `.trim(),

    redirect: `
💡 <b>Want more daily tips, bonuses &amp; tournaments?</b>

Join our <b>Official Zuriplay Kenya</b> channel — exclusive content, live updates &amp; giveaways every day!

👉 <a href="${KE_GROUP}">Join Zuriplay Kenya</a>
🎯 <a href="${BASE}/register?ref=tg_ke_redir">Register on Zuriplay</a>
    `.trim(),
  },

  ethiopia: {
    registration: `
🎯 <b>ለማሸነፍ ዝግጁ ነዎት?</b>

በ<b>Zuriplay</b> ይመዝገቡ እና ዛሬ ማሸነፍ ይጀምሩ!

✅ በ2 ደቂቃ ይመዝገቡ
🎁 የመጀመሪያ ተቀማጭ ቦነስ
💸 ፈጣን ክፍያ
🏆 ዕለታዊ ቱርናሜንቶች

👉 <a href="${BASE}/register?ref=tg_et">አሁን ይመዝገቡ</a>
📲 <a href="${BASE}/refer?ref=tg_et">ጓደኛ ይጋብዙ &amp; ያሸንፉ</a>
    `.trim(),

    tournaments: ({ name, prize, deadline, link }) => `
🏆 <b>የዛሬ ቱርናሜንት</b>

<b>${name}</b>
💰 የሽልማት ገንዘብ: <b>${prize}</b>
⏰ የጊዜ ገደብ: ${deadline}

ጊዜው ከማለፉ በፊት ትንበያዎን ያድርጉ!

👉 <a href="${link ?? `${BASE}/tournaments?ref=tg_et`}">ቱርናሜንቱን ይቀላቀሉ</a>
📲 <a href="${BASE}/register?ref=tg_et_tour">በነፃ ይመዝገቡ</a>
    `.trim(),

    redirect: `
📲 <b>የኛን ዋና ቡድን ይቀላቀሉ!</b>

ልዩ ይዘት፣ ቦነሶች እና ዕለታዊ ቱርናሜንቶች ያግኙ!

👉 <a href="${ET_GROUP}">Zuriplay Ethiopia ቡድን ይቀላቀሉ</a>
🎯 <a href="${BASE}/register?ref=tg_et_redir">ይመዝገቡ</a>
    `.trim(),
  },
};
