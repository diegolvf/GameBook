import { GameStatus } from '../types';

export const STATUS_LABELS: Record<GameStatus, string> = {
  want_to_play: 'Quero jogar',
  playing: 'Jogando',
  paused: 'Parado',
  completed: 'Concluído',
};

export const STATUS_COLORS: Record<GameStatus, string> = {
  want_to_play: '#6C8CFF',
  playing: '#2ECC71',
  paused: '#F5A623',
  completed: '#9B59B6',
};

export const STATUS_LIST: GameStatus[] = [
  'want_to_play',
  'playing',
  'paused',
  'completed',
];