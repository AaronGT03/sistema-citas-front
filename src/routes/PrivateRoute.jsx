import { Navigate } from "react-router-dom";

function PrivateRoute({ children, rolPermitido }) {
  const token = sessionStorage.getItem("token");
  const usuario = JSON.parse(sessionStorage.getItem("usuario"));

  if (!token || !usuario) {
    return <Navigate to="/" replace />;
  }

  if (rolPermitido && usuario.rol !== rolPermitido) {
    if (usuario.rol === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (usuario.rol === "EMPRESA") {
      return <Navigate to="/empresa/inicio" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;