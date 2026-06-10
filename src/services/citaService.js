import api from "../api/api";

export const obtenerCitas = async () => {
  const response = await api.get("/citas");
  return response.data;
};