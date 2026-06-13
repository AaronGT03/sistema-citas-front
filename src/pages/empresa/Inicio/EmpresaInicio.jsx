import { useEffect, useState } from "react";
import EmpresaLayout from "../../../layouts/EmpresaLayout";
import LoadingOverlay from "../../../components/LoadingOverlay/LoadingOverlay";
import { obtenerCitas } from "../../../services/citasService";
import { obtenerServiciosEmpresa } from "../../../services/serviciosService";
import "./EmpresaInicio.css";
function EmpresaInicio() {
  const [citas, setCitas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const hoy = new Date();
  const diaHoy = String(hoy.getDate()).padStart(2, "0");
  const mesHoy = String(hoy.getMonth() + 1).padStart(2, "0");
  const anioHoy = hoy.getFullYear();
  const [mesActual, setMesActual] = useState(new Date().getMonth());
  const [anioActual, setAnioActual] = useState(new Date().getFullYear());

  const nombreMes = new Date(anioActual, mesActual).toLocaleDateString(
    "es-MX",
    {
      month: "long",
      year: "numeric",
    },
  );
  const mesAnterior = () => {
    if (mesActual === 0) {
      setMesActual(11);
      setAnioActual(anioActual - 1);
    } else {
      setMesActual(mesActual - 1);
    }
  };
  const mesSiguiente = () => {
    if (mesActual === 11) {
      setMesActual(0);
      setAnioActual(anioActual + 1);
    } else {
      setMesActual(mesActual + 1);
    }
  };
  const volverHoy = () => {
    const fecha = new Date();

    setMesActual(fecha.getMonth());
    setAnioActual(fecha.getFullYear());
  };

  const primerDiaMes = new Date(anioActual, mesActual, 1).getDay();
  const diasEnMes = new Date(anioActual, mesActual + 1, 0).getDate();

  const diasCalendario = [];

  for (let i = 0; i < primerDiaMes; i++) {
    diasCalendario.push(null);
  }

  for (let dia = 1; dia <= diasEnMes; dia++) {
    diasCalendario.push(dia);
  }

  const obtenerCitasPorDia = (dia) => {
    if (!dia) return [];

    const fecha = `${String(dia).padStart(2, "0")}/${String(
      mesActual + 1,
    ).padStart(2, "0")}/${anioActual}`;

    return citas.filter(
      (cita) => cita.fecha === fecha && cita.status === "AGENDADA",
    );
  };
  const fechaHoy = `${diaHoy}/${mesHoy}/${anioHoy}`;

  const citasMes = citas.filter((cita) => {
    const partes = cita.fecha?.split("/");
    if (!partes || partes.length !== 3) return false;

    const mes = partes[1];
    const anio = partes[2];

    return mes === mesHoy && anio === String(anioHoy);
  });

  const citasHoy = citas.filter(
    (cita) => cita.fecha === fechaHoy && cita.status === "AGENDADA",
  );

  const canceladas = citas.filter((cita) => cita.status === "CANCELADA");

  const serviciosActivos = servicios.filter((servicio) => servicio.activo);

  const citasPendientes = citas.filter((cita) => cita.status === "AGENDADA");
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);

      try {
        const citasData = await obtenerCitas();
        const serviciosData = await obtenerServiciosEmpresa(usuario.empresa_id);

        setCitas(citasData);
        setServicios(serviciosData);
      } catch (error) {
        console.error("Error al cargar inicio:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);
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
              <h2>{citasMes.length}</h2>
              <p>Citas programadas</p>
            </div>
          </div>

          <div className="empresa-stat-card green">
            <div className="empresa-stat-icon">🧾</div>
            <div>
              <h3>Servicios activos</h3>
              <h2>{serviciosActivos.length}</h2>
              <p>Servicios disponibles</p>
            </div>
          </div>

          <div className="empresa-stat-card purple">
            <div className="empresa-stat-icon">🕒</div>
            <div>
              <h3>Citas para hoy</h3>
              <h2>{citasHoy.length}</h2>
              <p>Citas programadas</p>
            </div>
          </div>

          <div className="empresa-stat-card red">
            <div className="empresa-stat-icon">✕</div>
            <div>
              <h3>Canceladas</h3>
              <h2>{canceladas.length}</h2>
              <p>Citas canceladas</p>
            </div>
          </div>
        </div>

        <div className="empresa-dashboard-grid">
          <div className="empresa-panel">
            <h2>Citas pendientes</h2>

            {citasPendientes.length === 0 ? (
              <div className="empresa-empty">
                <div>⏳</div>
                <h3>No hay citas pendientes</h3>
                <p>Aún no hay citas próximas para esta empresa.</p>
              </div>
            ) : (
              <div className="inicio-citas-lista">
                {citasPendientes.slice(0, 5).map((cita) => (
                  <div className="inicio-cita-card" key={cita.id}>
                    <div>
                      <h3>{cita.nombre}</h3>
                      <p>{cita.servicio_nombre}</p>
                    </div>

                    <div>
                      <strong>{cita.fecha}</strong>
                      <span>{cita.hora}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="empresa-panel calendario-panel">
            <div className="panel-header">
              <h2>Calendario</h2>
              <button onClick={volverHoy}>Hoy</button>
            </div>

            <div className="calendar-title">
              <button onClick={mesAnterior}>‹</button>
              <h3>{nombreMes}</h3> <button onClick={mesSiguiente}>›</button>
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
              {diasCalendario.map((day, index) => {
                const citasDia = obtenerCitasPorDia(day);
                const esHoy =
                  day === hoy.getDate() &&
                  mesActual === hoy.getMonth() &&
                  anioActual === hoy.getFullYear();
                return (
                  <div
                    key={index}
                    className={`calendar-day ${
                      esHoy ? "today" : ""
                    } ${citasDia.length > 0 ? "has-cita" : ""}`}
                  >
                    {day && (
                      <>
                        <span>{day}</span>

                        {citasDia.length > 0 && (
                          <div className="calendar-cita-dot">
                            {citasDia.length}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <LoadingOverlay show={loading} text="Cargando inicio..." />
    </EmpresaLayout>
  );
}

export default EmpresaInicio;
