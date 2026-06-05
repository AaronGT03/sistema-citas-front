import api from "../api/api";

export const login = async (email, password) => {
  const response = await api.post("/auth/login", null, {
    params: {
      email,
      password,
    },
  });

  return response.data;
};