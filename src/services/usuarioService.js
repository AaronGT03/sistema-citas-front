import api from "../api/api";

export const obtenerUsuarios = async () => {
  const response = await api.get("/usuarios");
  return response.data;
};

export const crearUsuario = async (usuario) => {
  const response = await api.post("/usuarios", null, {
    params: {
      nombre: usuario.nombre,
      email: usuario.email,
      password: usuario.password,
      rol: usuario.rol,
      empresa_id: usuario.empresa_id,
    },
  });

  return response.data;
};

export const eliminarUsuario = async (usuarioId) => {
  const response = await api.delete(`/usuarios/${usuarioId}`);
  return response.data;
};
export const editarUsuario = async (usuarioId, usuario) => {
  const params = {
    nombre: usuario.nombre,
    email: usuario.email,
    empresa_id: usuario.empresa_id || null,
  };

  if (usuario.password) {
    params.password = usuario.password;
  }

  const response = await api.put(
    `/usuarios/${usuarioId}`,
    null,
    { params }
  );

  return response.data;
};
