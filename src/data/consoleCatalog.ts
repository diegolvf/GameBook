import { ImageSourcePropType } from 'react-native';
import { BrandId } from '../types';

export interface Brand {
  id: BrandId;
  name: string;
  color: string;
  // quando você tiver o arquivo do logo, ex.: logo: require('../../assets/brands/nintendo.png')
  logo?: ImageSourcePropType;
}

export const BRANDS: Brand[] = [
  { id: 'nintendo', name: 'Nintendo', color: '#E60012' },
  { id: 'sony', name: 'Sony', color: '#1F4FA3' },
  { id: 'microsoft', name: 'Microsoft', color: '#107C10' },
  { id: 'sega', name: 'Sega', color: '#0089CF' },
  { id: 'neogeo', name: 'Neo Geo', color: '#B8860B' },
  { id: 'steam', name: 'Steam (PC e Steam Deck)', color: '#2A475E' },
  { id: 'atari', name: 'Atari', color: '#C1272D' },
];

export interface CatalogConsole {
  brand: BrandId;
  name: string;
  released: string | null; // "AAAA-MM-DD"
}

// Datas de primeiro lançamento no mundo. Confira cada uma antes de publicar.
export const CONSOLE_CATALOG: CatalogConsole[] = [
  // Nintendo
  { brand: 'nintendo', name: 'NES / Famicom', released: '1983-07-15' },
  { brand: 'nintendo', name: 'Super Nintendo / Super Famicom', released: '1990-11-21' },
  { brand: 'nintendo', name: 'Nintendo 64', released: '1996-06-23' },
  { brand: 'nintendo', name: 'GameCube', released: '2001-09-14' },
  { brand: 'nintendo', name: 'Wii', released: '2006-11-19' },
  { brand: 'nintendo', name: 'Wii U', released: '2012-11-18' },
  { brand: 'nintendo', name: 'Nintendo Switch', released: '2017-03-03' },
  { brand: 'nintendo', name: 'Nintendo Switch 2', released: '2025-06-05' },
  { brand: 'nintendo', name: 'Game Boy', released: '1989-04-21' },
  { brand: 'nintendo', name: 'Game Boy Color', released: '1998-10-21' },
  { brand: 'nintendo', name: 'Game Boy Advance', released: '2001-03-21' },
  { brand: 'nintendo', name: 'Nintendo DS', released: '2004-11-21' },
  { brand: 'nintendo', name: 'Nintendo 3DS', released: '2011-02-26' },

  // Sony
  { brand: 'sony', name: 'PlayStation', released: '1994-12-03' },
  { brand: 'sony', name: 'PlayStation 2', released: '2000-03-04' },
  { brand: 'sony', name: 'PlayStation 3', released: '2006-11-11' },
  { brand: 'sony', name: 'PlayStation 4', released: '2013-11-15' },
  { brand: 'sony', name: 'PlayStation 5', released: '2020-11-12' },
  { brand: 'sony', name: 'PlayStation Portable (PSP)', released: '2004-12-12' },
  { brand: 'sony', name: 'PlayStation Vita', released: '2011-12-17' },

  // Microsoft
  { brand: 'microsoft', name: 'Xbox', released: '2001-11-15' },
  { brand: 'microsoft', name: 'Xbox 360', released: '2005-11-22' },
  { brand: 'microsoft', name: 'Xbox One', released: '2013-11-22' },
  { brand: 'microsoft', name: 'Xbox Series X|S', released: '2020-11-10' },

  // Sega
  { brand: 'sega', name: 'Master System', released: '1985-10-20' },
  { brand: 'sega', name: 'Mega Drive / Genesis', released: '1988-10-29' },
  { brand: 'sega', name: 'Game Gear', released: '1990-10-06' },
  { brand: 'sega', name: 'Saturn', released: '1994-11-22' },
  { brand: 'sega', name: 'Dreamcast', released: '1998-11-27' },

  // Neo Geo
  { brand: 'neogeo', name: 'Neo Geo AES', released: '1990-04-26' },
  { brand: 'neogeo', name: 'Neo Geo CD', released: '1994-09-09' },
  { brand: 'neogeo', name: 'Neo Geo Pocket Color', released: '1999-03-16' },

  // Steam
  { brand: 'steam', name: 'PC (computador)', released: null },
  { brand: 'steam', name: 'Steam Deck', released: '2022-02-25' },

  // Atari
  { brand: 'atari', name: 'Atari 2600', released: '1977-09-11' },
  { brand: 'atari', name: 'Atari Lynx', released: '1989-09-01' },
  { brand: 'atari', name: 'Atari Jaguar', released: '1993-11-23' },
];

export function brandById(id: BrandId): Brand {
  return BRANDS.find((brand) => brand.id === id) ?? BRANDS[0];
}

export function catalogFor(brand: BrandId): CatalogConsole[] {
  return CONSOLE_CATALOG.filter((item) => item.brand === brand);
}