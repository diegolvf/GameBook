export interface TgdbGame {
  id: number;
  game_title: string;
  release_date: string | null;
  platform: number;
  region_id: number;
}

export interface TgdbBoxartImage {
  id: number;
  type: string;
  side: string; // 'front' ou 'back'
  filename: string;
}

export interface TgdbPlatform {
  id: number;
  name: string;
  alias: string;
}

export interface TgdbSearchResponse {
  code: number;
  status: string;
  data?: { count: number; games?: TgdbGame[] };
  include?: {
    boxart?: {
      base_url: {
        thumb: string;
        small: string;
        medium: string;
        large: string;
        original: string;
      };
      data: Record<string, TgdbBoxartImage[]>;
    };
    platform?: Record<string, TgdbPlatform>;
  };
  remaining_monthly_allowance: number;
}