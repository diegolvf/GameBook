import { RawgGame, RawgListResponse } from '../types/rawgType';

const BASE_URL = 'https://api.rawg.io/api';
const API_KEY = process.env.EXPO_PUBLIC_RAWG_KEY;

async function request<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  if (!API_KEY) {
    throw new Error('Chave da RAWG não configurada (EXPO_PUBLIC_RAWG_KEY no .env).');
  }

  const query = Object.entries({ key: API_KEY, ...params })
    .map(([name, value]) => `${encodeURIComponent(name)}=${encodeURIComponent(String(value))}`)
    .join('&');

  const response = await fetch(`${BASE_URL}${path}?${query}`);
  if (!response.ok) {
    throw new Error(`A RAWG respondeu com erro ${response.status}.`);
  }
  return response.json();
}

export function searchGames(term: string, page = 1) {
  return request<RawgListResponse<RawgGame>>('/games', {
    search: term,
    page,
    page_size: 20,
  });
}