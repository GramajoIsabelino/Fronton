export type Group = { id: string; name: string };
export type Player = { id: string; name: string; groupId: string; createdAt: string };
export type Season = { id: string; name: string; year: number; groupId: string };

export type MatchWinner = 'teamA' | 'teamB';

export type MatchResult = {
  id: string;
  teamA: string[];
  teamB: string[];
  winner: MatchWinner;
  createdAt: string;
};

export type PlayerScore = {
  playerId: string;
  name: string;
  points: number;
  wins: number;
  losses: number;
  matchesPlayed: number;
};

export type Session = {
  id: string;
  date: string;
  seasonId?: string;
  groupId?: string;
  players: string[];
  status?: 'en juego' | 'finalizada' | 'pendiente';
  createdAt?: string;
  matches?: MatchResult[];
};
