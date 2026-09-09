import { supabase } from '@/integrations/supabase/client';

const MIN_DELAY_DAYS = 2;
const MAX_DELAY_DAYS = 7;

export function isEligibleForQuizToday(eventTimeIso: string, now = new Date()): boolean {
  const days = (now.getTime() - new Date(eventTimeIso).getTime()) / 86400000;
  return days >= MIN_DELAY_DAYS && days <= MAX_DELAY_DAYS;
}

export async function generateQuizForEligibleEntries(familyId: string) {
  const { data: entries } = await supabase
    .from('journal_entries').select('*')
    .eq('family_id', familyId).eq('quiz_eligible', true).eq('used_in_quiz', false);
  if (!entries) return;

  for (const entry of entries) {
    if (!isEligibleForQuizToday(entry.event_time)) continue;
    const { data: quiz, error } = await supabase.functions.invoke('generate-quiz', {
      body: { journalContent: entry.content },
    });
    if (error || !quiz) continue;

    await supabase.from('quiz_prompts').insert({
      family_id: familyId, source_journal_id: entry.id,
      question: quiz.question, correct_answer: quiz.correct_answer,
      wrong_options: quiz.wrong_options,
      scheduled_date: new Date().toISOString().slice(0, 10),
    });
    await supabase.from('journal_entries').update({ used_in_quiz: true }).eq('id', entry.id);
  }
}