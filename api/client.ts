import { MatchResult } from "../types";

// import { obtenerJornadaActiva } from '../api/client';

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


export async function getJugadores() {
    const response = await fetch(`${API_URL}/jugadores`);

    if (!response.ok) {
        throw new Error(
            `Error al obtener jugadores: ${response.statusText}`
        );
    }

    return response.json();
}

export async function getTemporadas() {
    const response = await fetch(`${API_URL}/temporadas`);

    if (!response.ok) {
        throw new Error(
            `Error al obtener temporadas: ${response.statusText}`
        );
    }

    return response.json();
}

export async function crearJornada(
    temporadaId: number,
    jugadores: number[]
) {
    const response = await fetch(`${API_URL}/jornadas`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            temporada_id: temporadaId,
            jugadores,
        }),
    });

    if (!response.ok) {
        const error = await response.text();

        throw new Error(
            `Error al crear jornada: ${error}`
        );
    }

    return response.json();
}

export async function guardarPartido(
    jornadaId: number,
    equipoA: number[],
    equipoB: number[],
    ganador: "A" | "B"
) {
    const response = await fetch(
        `${API_URL}/jornadas/${jornadaId}/partidos`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                equipo_a: equipoA,
                equipo_b: equipoB,
                ganador,
            }),
        }
    );

    if (!response.ok) {
        const error = await response.text();

        throw new Error(
            `Error al guardar partido: ${error}`
        );
    }

    return response.json();
}

export async function obtenerJornada(jornadaId: number) {
    const response = await fetch(
        `${API_URL}/jornadas/${jornadaId}`
    );

    if (!response.ok) {
        const error = await response.text();

        throw new Error(
            `Error al obtener jornada: ${error}`
        );
    }

    return response.json();
}

export async function obtenerEstadisticasJornada(
    jornadaId: number
) {
    const response = await fetch(
        `${API_URL}/jornadas/${jornadaId}/estadisticas`
    );

    if (!response.ok) {
        const error = await response.text();

        throw new Error(
            `Error al obtener estadísticas: ${error}`
        );
    }

    return response.json();
}

export async function cerrarJornada(jornadaId: number) {
    const response = await fetch(
        `${API_URL}/jornadas/${jornadaId}/cerrar`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        }
    );

    if (!response.ok) {
        const error = await response.text();

        console.error("Error cerrar jornada:", error);

        throw new Error(
            `Error al cerrar jornada: ${error}`
        );
    }

    return response.json();
}

export async function obtenerEstadisticasAnio(
    anio: number
) {
    const response = await fetch(
        `${API_URL}/estadisticas/anio/${anio}`
    );

    if (!response.ok) {
        const error = await response.text();

        throw new Error(
            `Error al obtener estadísticas del año: ${error}`
        );
    }

    return response.json();
}

export async function eliminarJornada(jornadaId: number) {
    const response = await fetch(`${API_URL}/jornadas/${jornadaId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error al eliminar jornada: ${error}`);
    }

    return response.json();
}


export async function obtenerJornadaActiva() {
    const response = await fetch(`${API_URL}/jornadas/activa`);

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error al obtener jornada activa: ${error}`);
    }

    return response.json();
}