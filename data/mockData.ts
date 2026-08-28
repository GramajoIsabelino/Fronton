import type { Group, Player, Season, Session } from '../types';

export const groups: Group[] = [
    { id: 'group-1', name: 'Los del Miércoles' },
    { id: 'group-2', name: 'Los del Domingo' },
];

export const players: Player[] = [
    { id: 'player-1', name: 'Juan', groupId: 'group-1', createdAt: '2026-01-10T12:00:00.000Z' },
    { id: 'player-2', name: 'Pedro', groupId: 'group-1', createdAt: '2026-01-10T12:00:00.000Z' },
    { id: 'player-3', name: 'Carlos', groupId: 'group-1', createdAt: '2026-01-10T12:00:00.000Z' },
    { id: 'player-4', name: 'Martín', groupId: 'group-1', createdAt: '2026-01-10T12:00:00.000Z' },
    { id: 'player-5', name: 'Diego', groupId: 'group-2', createdAt: '2026-01-15T12:00:00.000Z' },
    { id: 'player-6', name: 'Leo', groupId: 'group-2', createdAt: '2026-01-15T12:00:00.000Z' },
    { id: 'player-7', name: 'Nico', groupId: 'group-2', createdAt: '2026-01-15T12:00:00.000Z' },
    { id: 'player-8', name: 'Sebastián', groupId: 'group-2', createdAt: '2026-01-15T12:00:00.000Z' },
];

export const seasons: Season[] = [
    { id: 'season-2026-invierno', name: 'Invierno', year: 2026, groupId: 'group-1' },
    { id: 'season-2026-verano', name: 'Verano', year: 2026, groupId: 'group-2' },
];

export const activeSession: Session = {
    id: 'session-1',
    date: '2026-08-13',
    seasonId: 'season-2026-invierno',
    groupId: 'group-1',
    players: ['player-1', 'player-2', 'player-3', 'player-4'],
    status: 'en juego',
    createdAt: '2026-08-13T18:00:00.000Z',
};
