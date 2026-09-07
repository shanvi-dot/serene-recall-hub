import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { MobileShell, BackButton } from "@/components/mobile-shell";
import { SoftCard, Pill } from "@/components/soft-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/games/memory")({
  head: () => ({
    meta: [
      { title: "Memory Match — Lumen Care Game" },
      {
        name: "description",
        content:
          "Memory Match: turn over two cards at a time to find matching pairs. Pairs stay open, moves are counted, and a gentle message greets you at the end.",
      },
      { property: "og:title", content: "Memory Match — Lumen Care Game" },
      {
        property: "og:description",
        content: "Turn over two cards at a time and find every matching pair.",
      },
    ],
  }),
  component: MemoryGame,
});

const faces = [
  { id: "flower", emoji: "🌻", label: "Sunflower" },
  { id: "cat", emoji: "🐈", label: "Cat" },
  { id: "cup", emoji: "☕", label: "Cup of tea" },
  { id: "house", emoji: "🏡", label: "House" },
  { id: "boat", emoji: "⛵", label: "Boat" },
  { id: "cake", emoji: "🍰", label: "Cake" },
];

type Card = { key: string; faceId: string; emoji: string; label: string };

function makeDeck(pairs: number): Card[] {
  const chosen = faces.slice(0, pairs);
  const deck = chosen.flatMap((f, i) => [
    { key: `${f.id}-a-${i}`, faceId: f.id, emoji: f.emoji, label: f.label },
    { key: `${f.id}-b-${i}`, faceId: f.id, emoji: f.emoji, label: f.label },
  ]);
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = deck[i]!;
    deck[i] = deck[j]!;
    deck[j] = a;
  }
  return deck;
}

function MemoryGame() {
  const [pairs, setPairs] = useState(3);
  const [deck, setDeck] = useState<Card[]>(() => makeDeck(3));
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  const done = matched.length === pairs;

  useEffect(() => {
    if (flipped.length !== 2) return;
    setLocked(true);
    const [aKey, bKey] = flipped;
    const a = deck.find((c) => c.key === aKey);
    const b = deck.find((c) => c.key === bKey);
    const isMatch = !!a && !!b && a.faceId === b.faceId;
    const t = setTimeout(() => {
      if (isMatch && a) setMatched((m) => [...m, a.faceId]);
      setFlipped([]);
      setLocked(false);
      if (isMatch) toast.success("A pair! Beautifully spotted.");
    }, isMatch ? 500 : 900);
    return () => clearTimeout(t);
  }, [flipped, deck]);

  useEffect(() => {
    if (done) toast.success(`All pairs matched in ${moves} moves!`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  function newGame(nextPairs = pairs) {
    setPairs(nextPairs);
    setDeck(makeDeck(nextPairs));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setLocked(false);
  }

  function flip(card: Card) {
    if (locked || done) return;
    if (matched.includes(card.faceId) || flipped.includes(card.key)) return;
    const next = [...flipped, card.key];
    setFlipped(next);
    if (next.length === 2) setMoves((m) => m + 1);
  }

  const columns = useMemo(() => (deck.length > 8 ? "grid-cols-4" : "grid-cols-3"), [deck.length]);

  return (
    <MobileShell>
      <main>
        <div className="mb-4 flex items-center gap-3">
          <BackButton label="Back to games" />
          <h1 className="text-xl font-bold">Memory Match — {pairs} pairs</h1>
        </div>

        <SoftCard className="text-center">
          <p className="text-lg font-semibold text-primary">
            {done ? "Wonderful — every pair is matched!" : "Turn over two cards to find a pair"}
          </p>
          <div className="mt-3 flex items-center justify-center gap-3">
            <Pill tone="primary">Moves {moves}</Pill>
            <Pill tone="success">
              Pairs {matched.length} of {pairs}
            </Pill>
          </div>
        </SoftCard>

        <div className={`mt-5 grid gap-3 ${columns}`}>
          {deck.map((card) => {
            const open = matched.includes(card.faceId) || flipped.includes(card.key);
            return (
              <button
                key={card.key}
                onClick={() => flip(card)}
                aria-label={open ? card.label : "Hidden card"}
                className={`tap-press flex min-h-24 items-center justify-center rounded-3xl text-4xl transition-colors ${
                  open ? "bg-card" : "gold-bg"
                }`}
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <span aria-hidden="true">{open ? card.emoji : "❔"}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex gap-3">
          {done && pairs < faces.length ? (
            <Button
              variant="gold"
              size="care"
              className="flex-1 font-bold"
              onClick={() => newGame(pairs + 1)}
            >
              Add a pair
            </Button>
          ) : null}
          <Button
            variant="softOutline"
            size="care"
            className="flex-1 font-bold"
            onClick={() => newGame()}
          >
            {done ? "Play again" : "Shuffle and restart"}
          </Button>
        </div>
      </main>
    </MobileShell>
  );
}
