// Daily news & facts — one gentle item per day.
// TODO: replace `dailyItems` with rows imported from your CSV file.
// Expected CSV columns: title, body, category (news | fact | tip), image (optional URL)

export type DailyItem = {
  title: string;
  body: string;
  category: "news" | "fact" | "tip";
  image?: string;
};

export const dailyItems: DailyItem[] = [
  {
    title: "Sea otters hold hands while they sleep",
    body: "So they don't drift away from each other in the water. Sometimes whole groups float together in a 'raft'.",
    category: "fact",
  },
  {
    title: "A gentle walk boosts the brain",
    body: "Studies show a 20-minute daily walk supports memory and lifts mood. Even a stroll around the garden counts.",
    category: "tip",
  },
  {
    title: "Brighton Festival opens this weekend",
    body: "The annual arts festival returns with music, theatre and seaside events through the month.",
    category: "news",
  },
  {
    title: "Honey never spoils",
    body: "Archaeologists have tasted honey found in ancient Egyptian tombs — thousands of years old and still good.",
    category: "fact",
  },
  {
    title: "Music can unlock memories",
    body: "Songs from your younger years often stay vivid. Try listening to a favourite tune from your twenties today.",
    category: "tip",
  },
  {
    title: "Butterflies taste with their feet",
    body: "Tiny sensors on their feet tell them whether a leaf is good for laying eggs.",
    category: "fact",
  },
  {
    title: "Local library starts a reading circle",
    body: "A free weekly reading group begins Thursday mornings, with tea and large-print books available.",
    category: "news",
  },
];

export const categoryLabel: Record<DailyItem["category"], string> = {
  news: "News of the day",
  fact: "Did you know?",
  tip: "Gentle tip",
};

export function todaysItem(): DailyItem {
  const day = Math.floor(Date.now() / 86_400_000);
  return dailyItems[day % dailyItems.length]!;
}
