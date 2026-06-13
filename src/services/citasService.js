import api from "../api/api";

export const obtenerCitas = async () => {
  const response = await api.get("/citas");
  return response.data;
};

export const cancelarCita = async (citaId) => {
  const response = await api.put(`/citas/${citaId}/cancelar`);
  return response.data;
};

export const reprogramarCita = async (citaId, nuevaFecha, nuevaHora) => {
  const response = await api.post(`/citas/${citaId}/reprogramar`, null, {
    params: {
      nueva_fecha: nuevaFecha,
      nueva_hora: nuevaHora,
    },
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
    },
  });

  return response.data;
};