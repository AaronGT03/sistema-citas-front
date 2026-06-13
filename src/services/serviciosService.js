import api from "../api/api";

export const obtenerServiciosEmpresa = async (empresaId) => {
  const response = await api.get(`/servicios/empresa/${empresaId}`);
  return response.data;
};

export const crearServicio = async (servicio) => {
  const response = await api.post("/servicios", servicio);
  return response.data;
};

export const actualizarServicio = async (servicioId, datos) => {
  const response = await api.put(`/servicios/${servicioId}`, datos);
  return response.data;
};

export const eliminarServicio = async (servicioId) => {
  const response = await api.delete(`/servicios/${servicioId}`);
  return response.data;
};