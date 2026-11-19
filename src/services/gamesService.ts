import { supabase } from './supabase';
import { Game } from '../types';

export type NewGame = Omit<Game, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export async function addGame(game: NewGame): Promise<Game> {
    const { data, error } = await supabase
        .from('games')
        .insert(game)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data as Game;
}

export async function listGames(): Promise<Game[]> {
    const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []) as Game[];
}