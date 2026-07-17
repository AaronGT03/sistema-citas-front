import api from "../api/api";

export const obtenerPrestadoresEmpresa = async (empresaId) => {
  const response = await api.get(`/prestadores/empresa/${empresaId}`);
  return response.data;
};

export const obtenerPrestador = async (prestadorId) => {
  const response = await api.get(`/prestadores/${prestadorId}`);
  return response.data;
};

export const crearPrestador = async (prestador) => {
  const response = await api.post("/prestadores/", prestador);
  return response.data;
};

export const actualizarPrestador = async (prestadorId, datos) => {
  const response = await api.put(`/prestadores/${prestadorId}`, datos);
  return response.data;
};

export const obtenerCitasPrestador = async (prestadorId) => {
  const response = await api.get(`/prestadores/${prestadorId}/citas`);
  return response.data;
};

export const obtenerDisponibilidadPrestador = async (prestadorId, fecha) => {
  const response = await api.get(`/prestadores/${prestadorId}/disponibilidad`, {
    params: { fecha },
  });
  return response.data;
};
