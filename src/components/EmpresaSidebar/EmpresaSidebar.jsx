import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo2.png";
import "./EmpresaSidebar.css";
  import { confirmar } from "../../utils/alerts";

function EmpresaSidebar() {
  const navigate = useNavigate();

  const usuario = JSON.parse(sessionStorage.getItem("usuario"));

  const logout = async () => {
    const aceptado = await confirmar({
      titulo: "Cerrar sesión",
      texto: "Tu sesión actual se cerrará.",
      icono: "warning",
      textoConfirmar: "Cerrar sesión",
      colorConfirmar: "#ef4444",
    });

    if (!aceptado) return;
    

    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <aside className="empresa-sidebar">
      <div className="empresa-sidebar-logo">
        <img src={logo} alt="MOGA" />
      </div>

      <nav className="empresa-sidebar-menu">
        <NavLink
          to="/empresa/inicio"
          className={({ isActive }) =>
            isActive ? "empresa-sidebar-item active" : "empresa-sidebar-item"
          }
        >
          🏠
          <span>Inicio</span>
        </NavLink>
        <NavLink
          to="/empresa/citas"
          className={({ isActive }) =>
            isActive ? "empresa-sidebar-item active" : "empresa-sidebar-item"
          }
        >
          📅
          <span>Mis Citas</span>
        </NavLink>
        <NavLink
          to="/empresa/servicios"
          className={({ isActive }) =>
            isActive ? "empresa-sidebar-item active" : "empresa-sidebar-item"
          }
        >
          🧾
          <span>Servicios</span>
        </NavLink>
        <NavLink
          to="/empresa/prestadores"
          className={({ isActive }) =>
            isActive ? "empresa-sidebar-item active" : "empresa-sidebar-item"
          }
        >
          ✂️
          <span>Prestadores</span>
        </NavLink>
        <NavLink
          to="/empresa/estadisticas"
          className={({ isActive }) =>
            isActive ? "empresa-sidebar-item active" : "empresa-sidebar-item"
          }
        >
          📊
          <span>Estadísticas</span>
        </NavLink>
        <button className="empresa-sidebar-item mobile-logout" onClick={logout}>
          🚪
          <span>Salir</span>
        </button>
      </nav>

      <div className="empresa-sidebar-footer">
        <div className="empresa-sidebar-user">
          <div className="empresa-user-avatar">
            {usuario?.nombre?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h4>{usuario?.nombre}</h4>
            <span>{usuario?.rol}</span>
          </div>
        </div>

        <button className="empresa-logout-btn" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

export default EmpresaSidebar;
