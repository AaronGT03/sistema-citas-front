import api from "../api/api";

export const obtenerEmpresas = async () => {
  const response = await api.get("/empresas");
  return response.data;
};

export const crearEmpresa = async (empresa) => {
  const response = await api.post("/empresas", null, {
    params: {
      nombre: empresa.nombre,
      telefono_twilio: empresa.telefono_twilio,
      horario_inicio: empresa.horario_inicio,
      horario_fin: empresa.horario_fin,
    },
  });

  return response.data;
};
export const editarEmpresa = async (empresaId, empresa) => {
  const response = await api.put(`/empresas/${empresaId}`, null, {
    params: {
      nombre: empresa.nombre,
      telefono_twilio: empresa.telefono_twilio,
      horario_inicio: empresa.horario_inicio,
      horario_fin: empresa.horario_fin,
      activa: empresa.activa,
    },
  });

  return response.data;
};
export const eliminarEmpresa = async (empresaId) => {
  const response = await api.delete(`/empresas/${empresaId}`);
  return response.data;
};