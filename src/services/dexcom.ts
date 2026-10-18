import * as Linking from 'expo-linking';
import { getSupabase } from '@/sync/supabaseClient';

export interface DexcomStatus {
  connected: boolean;
  lastSyncedAt: string | null;
  error: string | null;
}

type FunctionReply<T> = { data: T | null; error: { message?: string } | null };

async function invoke<T>(action: string): Promise<T> {
  const sb = getSupabase();
  if (!sb) throw new Error('Device connections require a configured online account service.');
  const reply = (await sb.functions.invoke('dexcom', { body: { action } })) as FunctionReply<T>;
  if (reply.error || !reply.data) throw new Error(reply.error?.message ?? 'Unable to contact Dexcom.');
  return reply.data;
}

/** Status deliberately excludes credential and glucose data. */
export const dexcomService = {
  status: () => invoke<DexcomStatus>('status'),
  async connect(): Promise<void> {
    const data = await invoke<{ authorizationUrl: string }>('connect');
    await Linking.openURL(data.authorizationUrl);
  },
  sync: () => invoke<{ imported: number }>('sync'),
  disconnect: () => invoke<{ disconnected: boolean }>('disconnect'),
};
