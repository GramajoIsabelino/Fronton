const API_URL = "http://38.180.221.20:3000";

export async function getJugadores() {
    const response = await fetch(`${API_URL}/jugadores`);

    if (!response.ok) {
        throw new Error(`Error al obtener jugadores: ${response.statusText}`);
    }

    return response.json();
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

export async function getTemporadas() {
    const response = await fetch(`${API_URL}/temporadas`);

    if (!response.ok) {
        throw new Error(`Error al obtener temporadas: ${response.statusText}`);
    }

    return response.json();
}   