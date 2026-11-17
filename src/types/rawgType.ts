export interface RawgPlatform {
  id: number;
  name: string;
  slug: string;
}

export interface RawgGame {
  id: number;
  name: string;
  released: string | null;
  background_image: string | null;
  genres: { id: number; name: string }[];
  platforms: { platform: RawgPlatform }[] | null;
}

export interface RawgListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}