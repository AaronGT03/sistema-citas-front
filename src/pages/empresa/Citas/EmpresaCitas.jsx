import { useEffect, useRef, useState } from "react";
import EmpresaLayout from "../../../layouts/EmpresaLayout";
import LoadingOverlay from "../../../components/LoadingOverlay/LoadingOverlay";

import "./EmpresaCitas.css";

import {
  confirmar,
  alertaExito,
  alertaError,
  alertaNuevaCita,
} from "../../../utils/alerts";



import {
  obtenerCitas,
  cancelarCita,
  reprogramarCita,
  crearCita,
} from "../../../services/citasService";
import { obtenerServiciosEmpresa } from "../../../services/serviciosService";
import { obtenerPrestadoresEmpresa } from "../../../services/prestadorService";
import { obtenerEmpresa } from "../../../services/empresaService";

function EmpresaCitas() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [modalReprogramar, setModalReprogramar] = useState(false);

  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  const [nuevaFecha, setNuevaFecha] = useState("");

  const [nuevaHora, setNuevaHora] = useState("");
  const [nuevoPrestadorId, setNuevoPrestadorId] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODAS");
  const [filtroPrestador, setFiltroPrestador] = useState("TODOS");

    const usuario = JSON.parse(sessionStorage.getItem("usuario"));

  const [modalNuevaCita, setModalNuevaCita] = useState(false);
  const [servicios, setServicios] = useState([]);
  const [prestadores, setPrestadores] = useState([]);
  const [empresa, setEmpresa] = useState(null);

  const [nuevaCita, setNuevaCita] = useState({
    nombre: "",
    telefono: "",
    fecha: "",
    hora: "",
    servicio_id: "",
    prestador_id: "",
  });

  const idsConocidosRef = useRef(null);

  const cargarCitas = async () => {
    setLoading(true);

    try {
      const [data, serviciosData, prestadoresData, empresaData] = await Promise.all([
        obtenerCitas(),
        obtenerServiciosEmpresa(usuario.empresa_id),
        obtenerPrestadoresEmpresa(usuario.empresa_id),
        obtenerEmpresa(usuario.empresa_id),
      ]);

      setCitas(data);
      idsConocidosRef.current = new Set(data.map((cita) => cita.id));
      setServicios(serviciosData);
      setPrestadores(prestadoresData);
      setEmpresa(empresaData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const verificarNuevasCitas = async () => {
    if (idsConocidosRef.current === null) return;

    try {
      const data = await obtenerCitas();
      const nuevas = data.filter((cita) => !idsConocidosRef.current.has(cita.id));

      idsConocidosRef.current = new Set(data.map((cita) => cita.id));

      if (nuevas.length > 0) {
        setCitas(data);
        nuevas.forEach((cita) => alertaNuevaCita(cita));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  useEffect(() => {
    const intervalo = setInterval(verificarNuevasCitas, 20000);
    return () => clearInterval(intervalo);
  }, []);

  const handleCancelar = async (id) => {
    const aceptado = await confirmar({
      titulo: "Cancelar cita",
      texto: "Esta cita cambiará a estado CANCELADA.",
      icono: "warning",
      textoConfirmar: "Sí, cancelar",
      colorConfirmar: "#ef4444",
    });

    if (!aceptado) return;

    setLoading(true);

    try {
      await cancelarCita(id);
      await cargarCitas();

      alertaExito("Cita cancelada", "La cita fue cancelada correctamente.");
    } catch (error) {
      console.error(error);
      alertaError("Error", "No fue posible cancelar la cita.");
    } finally {
      setLoading(false);
    }
  };

  const abrirReprogramar = (cita) => {
    setCitaSeleccionada(cita);

    setNuevaFecha(cita.fecha);

    setNuevaHora(cita.hora);

    setNuevoPrestadorId(cita.prestador_id || "");

    setModalReprogramar(true);
  };
  const guardarReprogramacion = async () => {
    setModalReprogramar(false);
    const aceptado = await confirmar({
      titulo: "Reprogramar cita",
      texto:
        "La cita actual será cancelada y se creará una nueva con la fecha y hora seleccionadas.",
      icono: "warning",
      textoConfirmar: "Reprogramar",
      colorConfirmar: "#f59e0b",
    });

    if (!aceptado){
      setModalReprogramar(true);
      return;
    }

    setLoading(true);

    try {
      await reprogramarCita(
        citaSeleccionada.id,
        nuevaFecha,
        nuevaHora,
        nuevoPrestadorId || null,
      );

      setModalReprogramar(false);

      await cargarCitas();

      alertaExito(
        "Cita reprogramada",
        "La cita fue reprogramada correctamente.",
      );
    } catch (error) {
      console.error(error);
      setModalReprogramar(true);

      alertaError("Error", "No fue posible reprogramar la cita.");
    } finally {
      setLoading(false);
    }
  };
  const guardarNuevaCita = async () => {
    setModalNuevaCita(false);
    const aceptado = await confirmar({
      titulo: "Crear cita",
      texto: "Se registrará una nueva cita para este cliente.",
      icono: "question",
      textoConfirmar: "Crear cita",
    });

    if (!aceptado){
      setModalNuevaCita(true);
      return;
    }

    setLoading(true);

    try {
      await crearCita({
        ...nuevaCita,
        servicio_id: Number(nuevaCita.servicio_id),
        prestador_id: nuevaCita.prestador_id
          ? Number(nuevaCita.prestador_id)
          : null,
      });

      setNuevaCita({
        nombre: "",
        telefono: "",
        fecha: "",
        hora: "",
        servicio_id: "",
        prestador_id: "",
      });

      await cargarCitas();

      alertaExito("Cita creada", "La cita fue registrada correctamente.");
    } catch (error) {
      console.error(error);
      setModalNuevaCita(true);

      alertaError("Error", "No fue posible crear la cita.");
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

    const coincidePrestador =
      filtroPrestador === "TODOS" ||
      String(cita.prestador_id) === filtroPrestador;

    return coincideNombre && coincideEstado && coincidePrestador;
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
          <button
            className="btn-nueva-cita"
            onClick={() => setModalNuevaCita(true)}
          >
            + Nueva cita
          </button>
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

          {prestadores.length > 0 && (
            <select
              className={`citas-filtro-btn citas-filtro-select ${
                filtroPrestador !== "TODOS" ? "active" : ""
              }`}
              value={filtroPrestador}
              onChange={(e) => setFiltroPrestador(e.target.value)}
            >
              <option value="TODOS">Todos los prestadores</option>
              {prestadores.map((prestador) => (
                <option key={prestador.id} value={String(prestador.id)}>
                  {prestador.nombre}
                </option>
              ))}
            </select>
          )}
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

                  {cita.prestador_nombre && (
                    <span className="badge-prestador">👤 {cita.prestador_nombre}</span>
                  )}

                  {cita.canal && (
                    <span className="badge-info">{cita.canal}</span>
                  )}

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

            {empresa?.usa_prestadores && (
              <>
                <label>Prestador</label>
                <select
                  value={nuevoPrestadorId}
                  onChange={(e) => setNuevoPrestadorId(e.target.value)}
                >
                  <option value="">Mantener el mismo</option>
                  {prestadores
                    .filter(
                      (prestador) =>
                        prestador.activo &&
                        (!citaSeleccionada?.servicio_id ||
                          prestador.servicios?.some(
                            (servicio) =>
                              String(servicio.id) ===
                              String(citaSeleccionada?.servicio_id),
                          )),
                    )
                    .map((prestador) => (
                      <option key={prestador.id} value={prestador.id}>
                        {prestador.nombre}
                      </option>
                    ))}
                </select>
              </>
            )}

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
      {modalNuevaCita && (
        <div className="modal-overlay">
          <div className="modal-servicio">
            <h2>Nueva cita</h2>

            <label>Nombre del cliente</label>
            <input
              type="text"
              value={nuevaCita.nombre}
              onChange={(e) =>
                setNuevaCita({ ...nuevaCita, nombre: e.target.value })
              }
            />

            <label>Teléfono</label>
            <input
              type="text"
              value={nuevaCita.telefono}
              onChange={(e) =>
                setNuevaCita({ ...nuevaCita, telefono: e.target.value })
              }
            />

            <label>Servicio</label>
            <select
              value={nuevaCita.servicio_id}
              onChange={(e) =>
                setNuevaCita({
                  ...nuevaCita,
                  servicio_id: e.target.value,
                  prestador_id: "",
                })
              }
            >
              <option value="">Selecciona un servicio</option>

              {servicios
                .filter((servicio) => servicio.activo)
                .map((servicio) => (
                  <option key={servicio.id} value={servicio.id}>
                    {servicio.nombre}
                  </option>
                ))}
            </select>

            <label>Fecha</label>
            <input
              type="text"
              placeholder="15/10/2026"
              value={nuevaCita.fecha}
              onChange={(e) =>
                setNuevaCita({ ...nuevaCita, fecha: e.target.value })
              }
            />

            <label>Hora</label>
            <input
              type="text"
              placeholder="10:00"
              value={nuevaCita.hora}
              onChange={(e) =>
                setNuevaCita({ ...nuevaCita, hora: e.target.value })
              }
            />

            {empresa?.usa_prestadores && (
              <>
                <label>Prestador</label>
                <select
                  value={nuevaCita.prestador_id}
                  onChange={(e) =>
                    setNuevaCita({ ...nuevaCita, prestador_id: e.target.value })
                  }
                >
                  <option value="">Cualquier prestador disponible</option>
                  {prestadores
                    .filter(
                      (prestador) =>
                        prestador.activo &&
                        (!nuevaCita.servicio_id ||
                          prestador.servicios?.some(
                            (servicio) =>
                              String(servicio.id) === String(nuevaCita.servicio_id),
                          )),
                    )
                    .map((prestador) => (
                      <option key={prestador.id} value={prestador.id}>
                        {prestador.nombre}
                      </option>
                    ))}
                </select>
              </>
            )}

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setModalNuevaCita(false)}
              >
                Cancelar
              </button>

              <button className="btn-save" onClick={guardarNuevaCita}>
                Crear cita
              </button>
            </div>
          </div>
        </div>
      )}
    </EmpresaLayout>
  );
}

export default EmpresaCitas;
