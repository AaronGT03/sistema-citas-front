import AdminLayout from "../../../layouts/AdminLayout";
import "./AdminDashboard.css";
import { useEffect, useState } from "react";
import { obtenerEmpresas } from "../../../services/empresaService";
import { obtenerUsuarios } from "../../../services/usuarioService";
import { obtenerCitas } from "../../../services/citaService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function AdminDashboard() {
  const fecha = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const diaActual = new Date().getDate();
  const [empresas, setEmpresas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [citas, setCitas] = useState([]);
  const mesActual = new Date().getMonth();
  const anioActual = new Date().getFullYear();

  const citasDelMes = citas.filter((cita) => {
    const [dia, mes, anio] = cita.fecha.split("/");

    const fechaCita = new Date(Number(anio), Number(mes) - 1, Number(dia));

    return (
      fechaCita.getMonth() === mesActual &&
      fechaCita.getFullYear() === anioActual &&
      cita.status === "AGENDADA"
    );
  });

  const citasPorEmpresa = empresas.map((empresa) => {
    const total = citas.filter((cita) => cita.empresa_id === empresa.id).length;

    return {
      empresa: empresa.nombre,
      citas: total,
    };
  });
  const hoy = new Date().toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const citasHoy = citas.filter(
    (cita) => cita.fecha === hoy && cita.status === "AGENDADA",
  );

  const citasCanceladas = citas.filter((cita) => cita.status === "CANCELADA");
  useEffect(() => {
    cargarDatos();
  }, []);
  const cargarDatos = async () => {
    try {
      const empresasData = await obtenerEmpresas();
      const usuariosData = await obtenerUsuarios();
      const citasData = await obtenerCitas();

      setEmpresas(empresasData);
      setUsuarios(usuariosData);
      setCitas(citasData);
    } catch (error) {
      console.log(error);
    }
  };

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
              <h2>{empresas.length}</h2>
              <p>Total registradas</p>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon">📅</div>
            <div>
              <h3>Citas del Mes</h3>
              <h2>{citasDelMes.length}</h2>
              <p>Citas programadas este mes</p>
            </div>
          </div>

          <div className="stat-card purple">
            <div className="stat-icon">👥</div>
            <div>
              <h3>Usuarios</h3>
              <h2>{usuarios.length}</h2>
              <p>Total registrados</p>
            </div>
          </div>

          <div className="stat-card red">
            <div className="stat-icon">✕</div>
            <div>
              <h3>Canceladas</h3>
              <h2>{citasCanceladas.length}</h2>
              <p>Citas canceladas</p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-panel chart-panel">
            <div className="panel-header">
              <div>
                <h2>Citas por empresa</h2>
                <p>Total de citas registradas por empresa</p>
              </div>
            </div>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={citasPorEmpresa}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,.08)"
                  />
                  <XAxis
                    dataKey="empresa"
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-10}
                    textAnchor="end"
                    height={60}
                    padding={{ left: 40, right: 40 }}
                  />
                  <YAxis domain={[0, "dataMax + 10"]} stroke="#94a3b8" allowDecimals={false} />

                  <Tooltip
                    contentStyle={{
                      background: "#071225",
                      border: "1px solid rgba(255,255,255,.08)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="citas"
                    stroke="#8b3dff"
                    strokeWidth={3}
                    dot={{
                      r: 5,
                      fill: "#00c8ff",
                    }}
                    activeDot={{
                      r: 7,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dashboard-panel appointments-panel">
            <div className="panel-header">
              <div>
                <h2>Últimas citas</h2>
                <p>Actividad reciente</p>
              </div>
            </div>

            <div className="appointments-list">
              {citas.length === 0 ? (
                <div className="empty-state compact">
                  <div>📅</div>
                  <h3>No hay citas registradas</h3>
                  <p>Aún no existen citas programadas.</p>
                </div>
              ) : (
                citas
                  .slice(-5)
                  .reverse()
                  .map((cita) => (
                    <div className="appointment-item" key={cita.id}>
                      <div className="appointment-avatar">
                        {cita.nombre?.charAt(0).toUpperCase()}
                      </div>

                      <div className="appointment-info">
                        <h4>{cita.nombre}</h4>
                        <p>
                          {cita.fecha} · {cita.hora}
                        </p>
                      </div>

                      <span
                        className={
                          cita.status === "CANCELADA"
                            ? "appointment-badge danger"
                            : "appointment-badge success"
                        }
                      >
                        {cita.status}
                      </span>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

export default AdminDashboard;
