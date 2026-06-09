import AdminLayout from "../../../layouts/AdminLayout";
import "./AdminDashboard.css";

function AdminDashboard() {
  const fecha = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <AdminLayout>
      <section className="admin-dashboard">
        <header className="dashboard-header">
          <h1>Dashboard Administrativo</h1>
          <p>{fecha}</p>
        </header>

        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon">🏢</div>
            <div>
              <h3>Empresas</h3>
              <h2>1</h2>
              <p>Total registradas</p>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon">📅</div>
            <div>
              <h3>Citas Hoy</h3>
              <h2>0</h2>
              <p>Citas programadas</p>
            </div>
          </div>

          <div className="stat-card purple">
            <div className="stat-icon">👥</div>
            <div>
              <h3>Usuarios</h3>
              <h2>2</h2>
              <p>Total registrados</p>
            </div>
          </div>

          <div className="stat-card red">
            <div className="stat-icon">✕</div>
            <div>
              <h3>Canceladas</h3>
              <h2>0</h2>
              <p>Citas canceladas</p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-panel calendar-panel">
            <div className="panel-header">
              <h2>Calendario</h2>
              <button>Hoy</button>
            </div>

            <div className="calendar-title">
              <button>‹</button>
              <h3>Junio 2026</h3>
              <button>›</button>
            </div>

            <div className="calendar-week">
              <span>Dom</span>
              <span>Lun</span>
              <span>Mar</span>
              <span>Mié</span>
              <span>Jue</span>
              <span>Vie</span>
              <span>Sáb</span>
            </div>

            <div className="calendar-days">
              {[31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 3, 4].map((day, index) => (
                <div
                  key={index}
                  className={`calendar-day ${day === 5 ? "today" : ""} ${
                    index === 0 || index > 30 ? "muted" : ""
                  }`}
                >
                  <span>{day}</span>
                  {[10, 17].includes(day) && <small></small>}
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-panel appointments-panel">
            <div className="panel-header">
              <h2>Últimas citas</h2>
              <button>Ver todas</button>
            </div>

            <div className="empty-state">
              <div>📅</div>
              <h3>No hay citas registradas</h3>
              <p>Aún no existen citas programadas.</p>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

export default AdminDashboard;