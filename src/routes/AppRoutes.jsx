import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";

import AdminDashboard from "../pages/admin/Dashboard/AdminDashboard";

import AdminEmpresas from "../pages/admin/Empresas/AdminEmpresas";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      <Route path="/empresa/inicio" element={<h1>Dashboard Empresa</h1>} />

      <Route path="/admin/empresas" element={<AdminEmpresas />} />
    </Routes>
  );
}

export default AppRoutes;
