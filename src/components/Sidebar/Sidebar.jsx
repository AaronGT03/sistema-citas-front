import "./Sidebar.css";
import logo from "../../assets/logo2.png";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.clear();
    navigate("/", { replace: true });
  };
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="MOGA" />
      </div>

      <nav className="sidebar-menu">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          🏠
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/empresas"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          🏢
          <span>Empresas</span>
        </NavLink>

        <NavLink
          to="/admin/usuarios"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          👥
          <span>Usuarios</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span>👤</span>
          <p>Administrador</p>
        </div>

        <button className="logout-btn" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
