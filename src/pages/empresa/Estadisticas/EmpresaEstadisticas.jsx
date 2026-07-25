import { useEffect, useState } from "react";
import EmpresaLayout from "../../../layouts/EmpresaLayout";
import LoadingOverlay from "../../../components/LoadingOverlay/LoadingOverlay";
import { obtenerEstadisticas } from "../../../services/citasService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

import "./EmpresaEstadisticas.css";

const COLORES_BARRAS = ["#8b3dff", "#00c8ff", "#22c55e", "#f59e0b", "#ef4444", "#ec4899"];

const NOMBRES_MES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function formatearMoneda(valor) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(valor || 0);
}

const hoy = new Date();
const mesActualInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

function formatearMesParam(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  return `${anio}-${mes}`;
}

function EmpresaEstadisticas() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [mesSeleccionado, setMesSeleccionado] = useState(mesActualInicio);

  const esMesActual = formatearMesParam(mesSeleccionado) === formatearMesParam(mesActualInicio);

  const mesAnterior = () => {
    setMesSeleccionado(
      (actual) => new Date(actual.getFullYear(), actual.getMonth() - 1, 1),
    );
  };

  const mesSiguiente = () => {
    if (esMesActual) return;

    setMesSeleccionado(
      (actual) => new Date(actual.getFullYear(), actual.getMonth() + 1, 1),
    );
  };

  const irAMesActual = () => setMesSeleccionado(mesActualInicio);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);

      try {
        const data = await obtenerEstadisticas(formatearMesParam(mesSeleccionado));
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [mesSeleccionado]);

  const [anio, mes] = stats?.mes ? stats.mes.split("-") : [];
  const nombreMes = mes ? NOMBRES_MES[Number(mes) - 1] : "";

  const serviciosData = (stats?.servicios_populares || []).map((item) => ({
    nombre: item.servicio,
    citas: item.citas,
  }));

  const horasData = [...(stats?.horas_populares || [])]
    .sort((a, b) => a.hora.localeCompare(b.hora))
    .map((item) => ({
      hora: item.hora,
      citas: item.citas,
    }));

  const llamadas = stats?.citas_por_canal?.LLAMADA || 0;
  const whatsapp = stats?.citas_por_canal?.WHATSAPP || 0;

  return (
    <EmpresaLayout>
      <LoadingOverlay show={loading} text="Cargando estadísticas..." />

      <section className="empresa-estadisticas">
        <header className="empresa-header estadisticas-header">
          <div>
            <h1>Estadísticas</h1>
            <p>
              {nombreMes
                ? `Resumen de ${nombreMes} de ${anio}${
                    esMesActual ? " · se reinicia automáticamente cada mes" : ""
                  }`
                : "Resumen del mes en curso"}
            </p>
          </div>

          <div className="estadisticas-selector-mes">
            <button onClick={mesAnterior} aria-label="Mes anterior">
              ‹
            </button>

            <span className="estadisticas-mes-actual">
              {nombreMes ? `${nombreMes} ${anio}` : "..."}
            </span>

            <button onClick={mesSiguiente} disabled={esMesActual} aria-label="Mes siguiente">
              ›
            </button>

            {!esMesActual && (
              <button className="estadisticas-btn-hoy" onClick={irAMesActual}>
                Mes actual
              </button>
            )}
          </div>
        </header>

        <div className="empresa-stats-grid">
          <div className="empresa-stat-card green">
            <div className="empresa-stat-icon">💰</div>
            <div>
              <h3>Ganancias del mes</h3>
              <h2>{formatearMoneda(stats?.ganancias_mes)}</h2>
              <p>Citas concluidas y no canceladas</p>
            </div>
          </div>

          <div className="empresa-stat-card blue">
            <div className="empresa-stat-icon">✅</div>
            <div>
              <h3>Citas concluidas</h3>
              <h2>{stats?.citas_concluidas_mes ?? 0}</h2>
              <p>Ya pasaron y no se cancelaron</p>
            </div>
          </div>

          <div className="empresa-stat-card purple">
            <div className="empresa-stat-icon">📞</div>
            <div>
              <h3>Por llamada</h3>
              <h2>{llamadas}</h2>
              <p>Citas agendadas por llamada</p>
            </div>
          </div>

          <div className="empresa-stat-card teal">
            <div className="empresa-stat-icon">💬</div>
            <div>
              <h3>Por WhatsApp</h3>
              <h2>{whatsapp}</h2>
              <p>Citas agendadas por WhatsApp</p>
            </div>
          </div>
        </div>

        <div className="empresa-dashboard-grid estadisticas-charts-grid">
          <div className="empresa-panel">
            <div className="panel-header">
              <h2>Servicios más populares</h2>
            </div>
            <p className="panel-subtitulo">Citas activas del mes por servicio</p>

            {serviciosData.length === 0 ? (
              <div className="empresa-empty">
                <div>📊</div>
                <h3>Sin datos todavía</h3>
                <p>Aún no hay citas registradas este mes.</p>
              </div>
            ) : (
              <div className="estadisticas-chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={serviciosData}
                    margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                    <XAxis
                      dataKey="nombre"
                      stroke="#94a3b8"
                      tick={{ fontSize: 12 }}
                      interval={0}
                    />
                    <YAxis stroke="#94a3b8" allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#071225",
                        border: "1px solid rgba(255,255,255,.08)",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="citas" radius={[8, 8, 0, 0]}>
                      {serviciosData.map((_, index) => (
                        <Cell key={index} fill={COLORES_BARRAS[index % COLORES_BARRAS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="empresa-panel">
            <div className="panel-header">
              <h2>Hora más concurrida</h2>
            </div>
            <p className="panel-subtitulo">Distribución de citas activas por hora</p>

            {horasData.length === 0 ? (
              <div className="empresa-empty">
                <div>🕒</div>
                <h3>Sin datos todavía</h3>
                <p>Aún no hay citas con hora este mes.</p>
              </div>
            ) : (
              <div className="estadisticas-chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={horasData}
                    margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                    <XAxis dataKey="hora" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#94a3b8" allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#071225",
                        border: "1px solid rgba(255,255,255,.08)",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="citas" fill="#00c8ff" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </section>
    </EmpresaLayout>
  );
}

export default EmpresaEstadisticas;
