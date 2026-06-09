import "./Sidebar.css";
import logo from "../../assets/logo2.png";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="MOGA" />
      </div>

      <nav className="sidebar-menu">

        <button className="sidebar-item active">
          🏠
          <span>Dashboard</span>
        </button>

        <button className="sidebar-item">
          🏢
          <span>Empresas</span>
        </button>

        <button className="sidebar-item">
          👥
          <span>Usuarios</span>
        </button>

      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span>👤</span>
          <p>Administrador</p>
        </div>

        <button className="logout-btn">
          🚪 Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;