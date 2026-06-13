import { useEffect, useState } from "react";
import EmpresaLayout from "../../../layouts/EmpresaLayout";
import LoadingOverlay from "../../../components/LoadingOverlay/LoadingOverlay";
import {
  obtenerCitas,
  cancelarCita,
  reprogramarCita,
} from "../../../services/citasService";
import { confirmarCancelacion } from "../../../utils/alerts";

import "./EmpresaCitas.css";

function EmpresaCitas() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [modalReprogramar, setModalReprogramar] = useState(false);

  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  const [nuevaFecha, setNuevaFecha] = useState("");

  const [nuevaHora, setNuevaHora] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODAS");

  const cargarCitas = async () => {
    setLoading(true);

    try {
      const data = await obtenerCitas();
      setCitas(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  const handleCancelar = async (id) => {
    const confirmar = window.confirm("¿Deseas cancelar esta cita?");

    if (!confirmar) return;

    setLoading(true);

    try {
      await cancelarCita(id);
      await cargarCitas();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const abrirReprogramar = (cita) => {
    setCitaSeleccionada(cita);

    setNuevaFecha(cita.fecha);

    setNuevaHora(cita.hora);

    setModalReprogramar(true);
  };
  const guardarReprogramacion = async () => {
    setLoading(true);

    try {
      await reprogramarCita(citaSeleccionada.id, nuevaFecha, nuevaHora);

      setModalReprogramar(false);

      await cargarCitas();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const citasFiltradas = citas.filter((cita) => {
    const coincideNombre = cita.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideEstado =
      filtroEstado === "TODAS" || cita.status === filtroEstado;

    return coincideNombre && coincideEstado;
  });

  return (
    <EmpresaLayout>
      <LoadingOverlay show={loading} text="Cargando citas..." />

      <section className="empresa-citas">
        <div className="citas-header">
          <div>
            <h1>Mis Citas</h1>
            <p>Gestiona todas las citas de tu empresa.</p>
          </div>

          <div className="citas-total">{citas.length} citas</div>
        </div>

        <div className="citas-search">
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="citas-filtros">
          <button
            className={`citas-filtro-btn ${
              filtroEstado === "TODAS" ? "active" : ""
            }`}
            onClick={() => setFiltroEstado("TODAS")}
          >
            Todas
          </button>

          <button
            className={`citas-filtro-btn ${
              filtroEstado === "AGENDADA" ? "active" : ""
            }`}
            onClick={() => setFiltroEstado("AGENDADA")}
          >
            Agendadas
          </button>

          <button
            className={`citas-filtro-btn ${
              filtroEstado === "CANCELADA" ? "active" : ""
            }`}
            onClick={() => setFiltroEstado("CANCELADA")}
          >
            Canceladas
          </button>
        </div>
        <div className="citas-lista">
          {citasFiltradas.map((cita) => (
            <div className="cita-card" key={cita.id}>
              <div className="cita-info">
                <h3>{cita.nombre}</h3>
                <div className="cita-date-row">
                  <div className="date-box">
                    <span className="date-icon">📅</span>
                    <div>
                      <small>Fecha</small>
                      <strong>{cita.fecha}</strong>
                    </div>
                  </div>

                  <div className="date-box">
                    <span className="date-icon">🕒</span>
                    <div>
                      <small>Hora</small>
                      <strong>{cita.hora}</strong>
                    </div>
                  </div>
                </div>
                <p className="cita-telefono">📞 {cita.telefono}</p>

                <div className="cita-meta">
                  <span className="badge-info">{cita.servicio_nombre}</span>

                  <span
                    className={
                      cita.status === "AGENDADA"
                        ? "badge-activo"
                        : "badge-inactivo"
                    }
                  >
                    {cita.status}
                  </span>
                </div>
              </div>
              {cita.status === "AGENDADA" && (
                <div className="cita-actions">
                  <button
                    className="btn-reprogramar"
                    onClick={() => abrirReprogramar(cita)}
                  >
                    Reprogramar
                  </button>

                  <button
                    className="btn-cancelar"
                    onClick={() => handleCancelar(cita.id)}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      {modalReprogramar && (
        <div className="modal-overlay">
          <div className="modal-servicio">
            <h2>Reprogramar cita</h2>

            <label>Cliente</label>
            <input type="text" value={citaSeleccionada?.nombre} disabled />

            <label>Nueva fecha</label>
            <input
              type="text"
              value={nuevaFecha}
              onChange={(e) => setNuevaFecha(e.target.value)}
              placeholder="03/10/2026"
            />

            <label>Nueva hora</label>
            <input
              type="text"
              value={nuevaHora}
              onChange={(e) => setNuevaHora(e.target.value)}
              placeholder="17:00"
            />

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setModalReprogramar(false)}
              >
                Cancelar
              </button>

              <button className="btn-save" onClick={guardarReprogramacion}>
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </EmpresaLayout>
  );
}

export default EmpresaCitas;
