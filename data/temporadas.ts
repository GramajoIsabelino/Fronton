
import type { Season } from '../types';

export const seasons: Season[] = [
    { id: 'season-2026-invierno', name: 'Invierno', year: 2026, groupId: 'group-1' },
    { id: 'season-2026-verano', name: 'Verano', year: 2026, groupId: 'group-2' },
    { id: 'season-2026-otoño', name: 'Otoño', year: 2026, groupId: 'group-1' },
    { id: 'season-2026-primavera', name: 'Primavera', year: 2026, groupId: 'group-2' },
];

export const seasonSections =
    [
        {
            name: 'Temporada 2026',
            data: seasons
        }
    ]