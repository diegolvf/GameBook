export type GameStatus = 'want_to_play' | 'playing' | 'paused' | 'completed';
export type GameFormat = 'physical' | 'digital';

export interface Profile {
  id: string;
  username: string;
  created_at: string;
}

export interface Console {
  id: string;
  user_id: string;
  platform_id: number | null;
  name: string;
  image_url: string | null;
  store: string | null;
  price: number | null;
  purchase_date: string | null; // formato "2026-11-13"
  notes: string | null;
  created_at: string;
}

export interface Game {
  id: string;
  user_id: string;
  rawg_id: number;
  title: string;
  cover_url: string | null;
  released: string | null;
  genres: string[];
  platform: string | null;
  console_id: string | null;
  format: GameFormat;
  status: GameStatus;
  store: string | null;
  price: number | null;
  purchase_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}