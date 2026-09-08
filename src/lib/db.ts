import Dexie, { type Table } from 'dexie';

export interface LocalJournalEntry {
  id: string; family_id: string;
  authored_by: 'patient' | 'caregiver'; author_name?: string;
  content: string; mood_emoji?: string;
  event_time: string; quiz_eligible?: boolean; used_in_quiz?: boolean;
  synced: 0 | 1;
}
export interface LocalGameSession {
  id: string; family_id: string;
  game_type: 'flip_card' | 'light_sequence';
  accuracy: number; response_time_avg: number; difficulty_level: number;
  event_time: string; synced: 0 | 1;
}
export interface LocalReminderLog {
  id: string; reminder_id: string; family_id: string;
  completed_at?: string; event_time: string; was_completed: boolean;
  synced: 0 | 1;
}
export interface LocalFlashcardLike {
  id: string; family_id: string; cultural_content_id: string;
  liked_at: string; synced: 0 | 1;
}
export interface CachedReminder {
  id: string; family_id: string; type: string; label: string;
  scheduled_time: string; recurrence: string;
}
export interface CachedQuizPrompt {
  id: string; family_id: string; source_journal_id: string;
  question: string; correct_answer: string; wrong_options: string[];
  scheduled_date: string; answered: boolean; was_correct?: boolean;
}
export interface CachedCulturalContent {
  id: string; category: string; state: string; title: string;
  image_url?: string; description: string; display_date?: string;
}

class NeuroMitraDB extends Dexie {
  journal_entries!: Table<LocalJournalEntry, string>;
  game_sessions!: Table<LocalGameSession, string>;
  reminder_logs!: Table<LocalReminderLog, string>;
  flashcard_likes!: Table<LocalFlashcardLike, string>;
  reminders!: Table<CachedReminder, string>;
  quiz_prompts!: Table<CachedQuizPrompt, string>;
  cultural_content!: Table<CachedCulturalContent, string>;

  constructor() {
    super('neuromitra');
    this.version(1).stores({
      journal_entries: 'id, family_id, synced, event_time',
      game_sessions: 'id, family_id, synced, event_time, game_type',
      reminder_logs: 'id, family_id, reminder_id, synced, event_time',
      flashcard_likes: 'id, family_id, synced',
      reminders: 'id, family_id',
      quiz_prompts: 'id, family_id, scheduled_date, answered',
      cultural_content: 'id, state, category',
    });
  }
}

export const db = new NeuroMitraDB();