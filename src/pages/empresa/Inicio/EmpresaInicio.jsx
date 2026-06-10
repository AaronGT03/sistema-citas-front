import EmpresaLayout from "../../../layouts/EmpresaLayout";
import "./EmpresaInicio.css";

function EmpresaInicio() {
  const usuario = JSON.parse(sessionStorage.getItem("usuario"));

  const fecha = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <EmpresaLayout>
      <section className="empresa-inicio">
        <header className="empresa-header">
          <div>
            <h1>Inicio</h1>
            <p>{fecha}</p>
          </div>
        </header>

        <div className="empresa-stats-grid">
          <div className="empresa-stat-card blue">
            <div className="empresa-stat-icon">📅</div>
            <div>
              <h3>Citas del mes</h3>
              <h2>0</h2>
              <p>Citas programadas</p>
            </div>
          </div>

          <div className="empresa-stat-card green">
            <div className="empresa-stat-icon">🧾</div>
            <div>
              <h3>Servicios activos</h3>
              <h2>0</h2>
              <p>Servicios disponibles</p>
            </div>
          </div>

          <div className="empresa-stat-card purple">
            <div className="empresa-stat-icon">🕒</div>
            <div>
              <h3>Citas para hoy</h3>
              <h2>0</h2>
              <p>Citas programadas</p>
            </div>
          </div>

          <div className="empresa-stat-card red">
            <div className="empresa-stat-icon">✕</div>
            <div>
              <h3>Canceladas</h3>
              <h2>0</h2>
              <p>Citas canceladas</p>
            </div>
          </div>
        </div>

        <div className="empresa-dashboard-grid">
          <div className="empresa-panel">
            <h2>Citas pendientes</h2>

            <div className="empresa-empty">
              <div>⏳</div>
              <h3>No hay citas pendientes</h3>
              <p>Aún no hay citas próximas para esta empresa.</p>
            </div>
          </div>

          <div className="empresa-panel calendario-panel">
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
              {[
                31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 3, 4,
              ].map((day, index) => (
                <div
                  key={index}
                  className={`calendar-day ${
                    day === new Date().getDate() ? "today" : ""
                  } ${index === 0 || index > 30 ? "muted" : ""}`}
                >
                  <span>{day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </EmpresaLayout>
  );
}

export default EmpresaInicio;
