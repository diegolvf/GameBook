export type GameStatus = 'want_to_play' | 'playing' | 'paused' | 'completed';
export type GameFormat = 'physical' | 'digital';

export type BrandId =
  | 'nintendo'
  | 'sony'
  | 'microsoft'
  | 'sega'
  | 'neogeo'
  | 'steam'
  | 'atari';

export interface Console {
  id: string;
  user_id: string;
  brand: BrandId;
  name: string;
  released: string | null; 
  variant: string | null; 
  edition: string | null;
  price: number | null;
  purchase_date: string | null;
  platform_id: number | null; // não usado nesta versão
  image_url: string | null; // não usado nesta versão
  store: string | null; // não usado nesta versão
  notes: string | null; // não usado nesta versão
  created_at: string;
}

export interface Profile {
  id: string;
  username: string;
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