import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/admin/dashboard"
        element={<h1>Dashboard Admin</h1>}
      />

      <Route
        path="/empresa/inicio"
        element={<h1>Dashboard Empresa</h1>}
      />
    </Routes>
  );
}

export default AppRoutes;