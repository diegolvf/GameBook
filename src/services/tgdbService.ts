import { TgdbSearchResponse } from '../types/tgdbType';

const BASE_URL = 'https://api.thegamesdb.net/v1';
const API_KEY = process.env.EXPO_PUBLIC_TGDB_KEY;

// "Hollow Knight: Edição!" -> "hollow knight edicao"
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // tira acentos
    .replace(/[^a-z0-9 ]/g, ' ') // tira pontuação
    .replace(/\s+/g, ' ')
    .trim();
}

const BRANDS = ['sony', 'microsoft', 'nintendo', 'sega'];

// nomes que a RAWG e a TheGamesDB escrevem de jeitos muito diferentes
const PLATFORM_ALIASES: Record<string, string> = {
  'xbox series s x': 'xbox series x',
};

// "Sony Playstation 4" e "PlayStation 4" -> "playstation 4"
function platformKey(name: string): string {
  let key = normalize(name);
  for (const brand of BRANDS) {
    if (key.startsWith(`${brand} `)) key = key.slice(brand.length + 1);
  }
  return PLATFORM_ALIASES[key] ?? key;
}

function samePlatform(wantedKey: string, tgdbName: string): boolean {
  const tgdbKey = platformKey(tgdbName);
  // o segundo teste cobre nomes como "Super Nintendo (SNES)", que termina em "snes"
  return tgdbKey === wantedKey || tgdbKey.endsWith(` ${wantedKey}`);
}

/**
 * Procura a capa de caixa (frente) do jogo na plataforma indicada.
 * Devolve a URL da imagem, ou null se não encontrar.
 */
export async function findCoverUrl(title: string, platformName: string): Promise<string | null> {
  if (!API_KEY) return null;

  const query =
    `apikey=${encodeURIComponent(API_KEY)}` +
    `&name=${encodeURIComponent(title)}` +
    `&include=boxart,platform`;

  const response = await fetch(`${BASE_URL}/Games/ByGameName?${query}`);
  if (!response.ok) return null;

  const json: TgdbSearchResponse = await response.json();
  console.log('TheGamesDB, cota restante:', json.remaining_monthly_allowance);
  if (json.code !== 200) return null;

  const games = json.data?.games ?? [];
  const boxart = json.include?.boxart;
  const platforms = json.include?.platform;
  if (!boxart || !platforms) return null;

  const wantedTitle = normalize(title);
  const wantedPlatform = platformKey(platformName);

  for (const game of games) {
    if (normalize(game.game_title) !== wantedTitle) continue;

    const platform = platforms[String(game.platform)];
    if (!platform || !samePlatform(wantedPlatform, platform.name)) continue;

    const front = boxart.data[String(game.id)]?.find((image) => image.side === 'front');
    if (front) return `${boxart.base_url.medium}${front.filename}`;
  }

  console.log('TheGamesDB: sem capa para', title, '/', platformName);
  return null;
}