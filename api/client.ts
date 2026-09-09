import { MatchResult } from "../types";

const API_URL = 'http://38.180.221.20:3000';

export type ApiPlayer = {
    id: number | string;
    nombre?: string;
    name?: string;
};

export type ApiSeason = {
    id: number | string;
    nombre?: string;
    name?: string;
    year?: number;
};

function getCollection<T>(data: unknown, key: string): T[] {
    if (Array.isArray(data)) {
        return data;
    }

    if (data && typeof data === 'object' && key in data) {
        const collection = (data as Record<string, unknown>)[key];
        if (Array.isArray(collection)) {
            return collection as T[];
        }
    }

    throw new Error(`La respuesta de ${key} no tiene un formato válido.`);
}

export async function getJugadores(): Promise<ApiPlayer[]> {
    const response = await fetch(`${API_URL}/jugadores`);

    if (!response.ok) {
        throw new Error(`Error al obtener jugadores: ${response.statusText}`);
    }

    return getCollection<ApiPlayer>(await response.json(), 'jugadores');
}

export async function crearJornada(temporadaId: number) {
    const response = await fetch(`${API_URL}/jornadas`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            temporada_id: temporadaId,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error al crear jornada: ${error}`);
    }

    return response.json();
}

export async function getTemporadas(): Promise<ApiSeason[]> {
    const response = await fetch(`${API_URL}/temporadas`);

    if (!response.ok) {
        throw new Error(`Error al obtener temporadas: ${response.statusText}`);
    }

    return getCollection<ApiSeason>(await response.json(), 'temporadas');
}


export async function guardarPartido(jornadaId: number, equipoA: number[], equipoB: number[], winner: string) {
    const response = await fetch(`${API_URL}/partidos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            jornada_id: jornadaId,
            equipo_a: equipoA,
            equipo_b: equipoB,
            ganador: winner,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error al guardar partido: ${error}`);
    }

    return response.json();
}   