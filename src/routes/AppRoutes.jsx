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
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/empresa/inicio"
        element={
          <PrivateRoute>
            <h1>Dashboard Empresa</h1>
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/empresas"
        element={
          <PrivateRoute>
            <AdminEmpresas />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/usuarios"
        element={
          <PrivateRoute>
            <AdminUsuarios />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
