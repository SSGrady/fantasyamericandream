import Dexie, { type Table } from 'dexie';
import type { PlaySession } from '../play-session';
import type { PhaseCheckpoint } from './types';

export interface RunRecord {
  id: string;
  gameState: PlaySession['gameState'];
  session: PlaySession;
  updatedAt: string;
  lastCheckpoint?: PhaseCheckpoint;
}

export class FantasyAmericanDreamDb extends Dexie {
  runs!: Table<RunRecord, string>;

  constructor() {
    super('fantasy-american-dream');
    this.version(1).stores({
      runs: 'id, updatedAt',
    });
  }
}

export const fadDb = new FantasyAmericanDreamDb();

export async function saveRunRecord(record: RunRecord): Promise<void> {
  await fadDb.runs.put(record);
}

export async function loadRunRecord(id: string): Promise<RunRecord | undefined> {
  return fadDb.runs.get(id);
}

export async function exportRunBlob(record: RunRecord): Promise<string> {
  return JSON.stringify(record, null, 2);
}

export function importRunBlob(json: string): RunRecord {
  const parsed = JSON.parse(json) as RunRecord;
  if (!parsed?.id || !parsed.gameState || !parsed.session) {
    throw new Error('Invalid run export blob');
  }
  return parsed;
}
