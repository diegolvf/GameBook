import { RawgGame } from '../types/rawgType';
import { Game } from '../types';
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppTabsParamList = {
  Collection: undefined;
  Consoles: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  Tabs: undefined;
  Search: undefined;
  AddGame: { game: RawgGame };
  GameDetail: { gameId: string };
  EditGame: { game: Game };
};