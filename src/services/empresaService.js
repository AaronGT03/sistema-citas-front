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