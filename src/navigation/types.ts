import { RawgGame } from '../types/rawgType';
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
};