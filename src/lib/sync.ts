import { db } from './db';
import { supabase } from '../integrations/supabase/client';

export async function syncPendingWrites() {
  if (!navigator.onLine) return;
  await syncTable('journal_entries');
  await syncTable('game_sessions');
  await syncTable('reminder_logs');
  await syncTable('flashcard_likes');
}

async function syncTable(
  tableName: 'journal_entries' | 'game_sessions' | 'reminder_logs' | 'flashcard_likes'
) {
  const table = db[tableName];
  const unsynced = await table.where('synced').equals(0).toArray();
  for (const row of unsynced) {
    const { synced, ...payload } = row as any;
    const { error } = await supabase.from(tableName).upsert(payload);
    if (!error) await table.update(row.id, { synced: 1 } as any);
    else console.error(`Sync failed for ${tableName}:${row.id}`, error.message);
  }
}

export function setupAutoSync() {
  window.addEventListener('online', syncPendingWrites);
  syncPendingWrites();
}