import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";

import AdminDashboard from "../pages/admin/Dashboard/AdminDashboard";

import AdminEmpresas from "../pages/admin/Empresas/AdminEmpresas";
import AdminUsuarios from "../pages/admin/Usuarios/AdminUsuarios";
import PrivateRoute from "./PrivateRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute rolPermitido="ADMIN">
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/empresa/inicio"
        element={
          <PrivateRoute rolPermitido="EMPRESA">
            <h1>Dashboard Empresa</h1>
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/empresas"
        element={
          <PrivateRoute rolPermitido="ADMIN">
            <AdminEmpresas />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/usuarios"
        element={
          <PrivateRoute rolPermitido="ADMIN">
            <AdminUsuarios />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
