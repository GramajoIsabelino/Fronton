export type SeasonName = 'Verano' | 'Otoño' | 'Invierno' | 'Primavera';
export type SessionStatus = 'pendiente' | 'en juego' | 'finalizada';
export type TeamSide = 'A' | 'B';

export interface Group {
    id: string;
    name: string;
    description?: string;
}

export interface Player {
    id: string;
    name: string;
    groupId?: string;
    createdAt: string;
}

export interface Season {
    id: string;
    name: SeasonName;
    year: number;
    groupId?: string;
}

export interface Session {
    id: string;
    date: string;
    seasonId: string;
    groupId: string;
    players: string[];
    status: SessionStatus;
    createdAt: string;
}

export interface MatchPlayer {
    playerId: string;
    team: TeamSide | 'NoParticipa';
    points: number;
}

export interface Match {
    id: string;
    sessionId: string;
    winner: TeamSide;
    players: MatchPlayer[];
    createdAt: string;
}

export interface SessionSummary {
    sessionId: string;
    playerId: string;
    matchesPlayed: number;
    matchesWon: number;
    matchesLost: number;
    points: number;
}
