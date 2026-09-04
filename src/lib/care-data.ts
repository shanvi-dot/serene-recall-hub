export const patient = {
  name: "Eleanor",
  fullName: "Eleanor Hayes",
  id: "PT-1042",
};

export type Memory = {
  id: string;
  title: string;
  description: string;
  date: string;
  who: string;
  where: string;
  image: string;
  sentiment: "happy" | "neutral" | "sad";
  quiz: { question: string; options: string[]; answer: number }[];
};

export const memories: Memory[] = [
  {
    id: "1",
    title: "Sunday lunch in the garden",
    description:
      "We had Sunday lunch in the garden with Mary and little Theo. Theo helped me pick tomatoes and we made lemonade together in the blue jug.",
    date: "12 August 2026",
    who: "Mary, Theo",
    where: "Home garden, Brighton",
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=70",
    sentiment: "happy",
    quiz: [
      { question: "Who helped you pick tomatoes?", options: ["Theo", "Mary", "The neighbour"], answer: 0 },
      { question: "What did you make together?", options: ["Lemonade", "Tea", "Soup"], answer: 0 },
      { question: "Where did this happen?", options: ["The garden", "The kitchen", "The park"], answer: 0 },
    ],
  },
  {
    id: "2",
    title: "Walk by the pier",
    description:
      "A long slow walk along the pier with Robert. The wind was strong so we shared a bag of hot chestnuts and watched the seagulls.",
    date: "4 August 2026",
    who: "Robert",
    where: "Brighton Pier",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=70",
    sentiment: "neutral",
    quiz: [
      { question: "Who joined you on the walk?", options: ["Robert", "Mary", "Theo"], answer: 0 },
      { question: "What did you share?", options: ["Hot chestnuts", "Ice cream", "Sandwiches"], answer: 0 },
    ],
  },
  {
    id: "3",
    title: "Birthday cake with the family",
    description:
      "Everyone came over for my birthday. There were seventy-eight candles, far too many, and Mary sang much too loudly.",
    date: "21 July 2026",
    who: "Mary, Robert, Theo, Anne",
    where: "Living room",
    image:
      "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=900&q=70",
    sentiment: "happy",
    quiz: [
      { question: "What was the occasion?", options: ["A birthday", "Christmas", "An anniversary"], answer: 0 },
      { question: "Who sang loudly?", options: ["Mary", "Robert", "Anne"], answer: 0 },
    ],
  },
];

export const reminders = [
  { id: "1", time: "08:00", text: "Take morning medication", done: true },
  { id: "2", time: "10:30", text: "Drink a glass of water", done: true },
  { id: "3", time: "13:00", text: "Lunch and afternoon tablet", done: false },
  { id: "4", time: "17:00", text: "Call daughter Mary", done: false },
  { id: "5", time: "20:30", text: "Evening medication", done: false },
];

export const weeklyScores = [
  { day: "Mon", score: 62 },
  { day: "Tue", score: 68 },
  { day: "Wed", score: 65 },
  { day: "Thu", score: 74 },
  { day: "Fri", score: 78 },
  { day: "Sat", score: 76 },
  { day: "Sun", score: 82 },
];

export const moodTrend = [
  { day: "Mon", mood: 3 },
  { day: "Tue", mood: 4 },
  { day: "Wed", mood: 3 },
  { day: "Thu", mood: 4 },
  { day: "Fri", mood: 5 },
  { day: "Sat", mood: 4 },
  { day: "Sun", mood: 5 },
];

export const sentimentLabel: Record<Memory["sentiment"], { emoji: string; label: string }> = {
  happy: { emoji: "😊", label: "Happy memory" },
  neutral: { emoji: "😌", label: "Calm memory" },
  sad: { emoji: "😔", label: "Tender memory" },
};

export function greeting(d = new Date()) {
  const h = d.getHours();
  if (h < 12) return "Good Morning";
  if (h < 18) return "Good Afternoon";
  return "Good Evening";
}

export function todayLabel(d = new Date()) {
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
