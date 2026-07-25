import api from "../api/api";

export const obtenerCitas = async (prestadorId) => {
  const response = await api.get("/citas", {
    params: prestadorId ? { prestador_id: prestadorId } : {},
  });
  return response.data;
};

export const cancelarCita = async (citaId) => {
  const response = await api.put(`/citas/${citaId}/cancelar`);
  return response.data;
};

export const reprogramarCita = async (
  citaId,
  nuevaFecha,
  nuevaHora,
  nuevoPrestadorId,
) => {
  const response = await api.post(`/citas/${citaId}/reprogramar`, null, {
    params: {
      nueva_fecha: nuevaFecha,
      nueva_hora: nuevaHora,
      ...(nuevoPrestadorId ? { nuevo_prestador_id: nuevoPrestadorId } : {}),
    },
  });

  return response.data;
};
export const obtenerEstadisticas = async (mes) => {
  const response = await api.get("/citas/estadisticas", {
    params: mes ? { mes } : {},
  });
  return response.data;
};

export const crearCita = async (cita) => {
  const response = await api.post("/citas", null, {
    params: {
      nombre: cita.nombre,
      telefono: cita.telefono,
      fecha: cita.fecha,
      hora: cita.hora,
      servicio_id: cita.servicio_id,
      ...(cita.prestador_id ? { prestador_id: cita.prestador_id } : {}),
    },
  });

  return response.data;
};