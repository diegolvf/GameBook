import { supabase } from './supabase';
import { Console as GameConsole } from '../types';

// Tudo do console, menos o que o banco preenche sozinho
export type NewConsole = Omit<GameConsole, 'id' | 'user_id' | 'created_at'>;
export type ConsoleChanges = Partial<NewConsole>;

export async function listConsoles(): Promise<GameConsole[]> {
  const { data, error } = await supabase
    .from('consoles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as GameConsole[];
}

export async function addConsole(newConsole: NewConsole): Promise<GameConsole> {
  const { data, error } = await supabase
    .from('consoles')
    .insert(newConsole)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as GameConsole;
}

export async function updateConsole(id: string, changes: ConsoleChanges): Promise<GameConsole> {
  const { data, error } = await supabase
    .from('consoles')
    .update(changes)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as GameConsole;
}

export async function deleteConsole(id: string): Promise<void> {
  const { error } = await supabase.from('consoles').delete().eq('id', id);
  if (error) throw new Error(error.message);
}