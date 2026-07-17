import { useEffect, useState } from "react";
import EmpresaLayout from "../../../layouts/EmpresaLayout";
import LoadingOverlay from "../../../components/LoadingOverlay/LoadingOverlay";
import {
  obtenerPrestadoresEmpresa,
  crearPrestador,
  actualizarPrestador,
  obtenerCitasPrestador,
} from "../../../services/prestadorService";
import { obtenerServiciosEmpresa } from "../../../services/serviciosService";
import { obtenerEmpresa } from "../../../services/empresaService";
import "./EmpresaPrestadores.css";

import { confirmar, alertaExito, alertaError } from "../../../utils/alerts";

function EmpresaPrestadores() {
  const usuario = JSON.parse(sessionStorage.getItem("usuario"));

  const [empresa, setEmpresa] = useState(null);
  const [prestadores, setPrestadores] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalEditar, setModalEditar] = useState(false);
  const [prestadorEditar, setPrestadorEditar] = useState(null);

  const [modalCitas, setModalCitas] = useState(false);
  const [citasPrestador, setCitasPrestador] = useState([]);
  const [prestadorCitas, setPrestadorCitas] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    servicio_ids: [],
  });

  const cargarDatos = async () => {
    setLoading(true);

    try {
      const [empresaData, prestadoresData, serviciosData] = await Promise.all([
        obtenerEmpresa(usuario.empresa_id),
        obtenerPrestadoresEmpresa(usuario.empresa_id),
        obtenerServiciosEmpresa(usuario.empresa_id),
      ]);

      setEmpresa(empresaData);
      setPrestadores(prestadoresData);
      setServicios(serviciosData);
    } catch (error) {
      console.error(error);
      alertaError("Error", "No fue posible cargar los prestadores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const toggleServicioForm = (servicioId) => {
    setForm((prev) => {
      const yaSeleccionado = prev.servicio_ids.includes(servicioId);

      return {
        ...prev,
        servicio_ids: yaSeleccionado
          ? prev.servicio_ids.filter((id) => id !== servicioId)
          : [...prev.servicio_ids, servicioId],
      };
    });
  };

  const toggleServicioEditar = (servicioId) => {
    setPrestadorEditar((prev) => {
      const actuales = prev.servicios.map((s) => s.id);
      const yaSeleccionado = actuales.includes(servicioId);

      const nuevosServicios = yaSeleccionado
        ? prev.servicios.filter((s) => s.id !== servicioId)
        : [
            ...prev.servicios,
            servicios.find((s) => s.id === servicioId),
          ];

      return { ...prev, servicios: nuevosServicios };
    });
  };

  const handleCrearPrestador = async (e) => {
    e.preventDefault();

    const aceptado = await confirmar({
      titulo: "Crear prestador",
      texto: "El prestador estará disponible para agendar citas.",
      icono: "question",
      textoConfirmar: "Crear",
    });

    if (!aceptado) return;

    setLoading(true);

    try {
      await crearPrestador({
        nombre: form.nombre,
        empresa_id: usuario.empresa_id,
        servicio_ids: form.servicio_ids,
      });

      setForm({ nombre: "", servicio_ids: [] });

      await cargarDatos();

      alertaExito("Prestador creado", "El prestador fue registrado correctamente.");
    } catch (error) {
      console.error(error);
      alertaError("Error", "No fue posible crear el prestador.");
    } finally {
      setLoading(false);
    }
  };

  const abrirEditar = (prestador) => {
    setPrestadorEditar(prestador);
    setModalEditar(true);
  };

  const guardarEdicion = async () => {
    setModalEditar(false);

    const aceptado = await confirmar({
      titulo: "Guardar cambios",
      texto: "Los datos del prestador serán actualizados.",
      icono: "question",
      textoConfirmar: "Guardar",
    });

    if (!aceptado) {
      setModalEditar(true);
      return;
    }

    setLoading(true);

    try {
      await actualizarPrestador(prestadorEditar.id, {
        nombre: prestadorEditar.nombre,
        servicio_ids: prestadorEditar.servicios.map((s) => s.id),
      });

      await cargarDatos();

      alertaExito("Prestador actualizado", "Los cambios fueron guardados correctamente.");
    } catch (error) {
      console.error(error);
      setModalEditar(true);
      alertaError("Error", "No fue posible actualizar el prestador.");
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (prestador) => {
    const aceptado = await confirmar({
      titulo: prestador.activo ? "Desactivar prestador" : "Activar prestador",
      texto: prestador.activo
        ? "Este prestador ya no podrá recibir citas nuevas."
        : "Este prestador volverá a estar disponible para citas.",
      icono: "warning",
      textoConfirmar: prestador.activo ? "Desactivar" : "Activar",
      colorConfirmar: prestador.activo ? "#ef4444" : "#22c55e",
    });

    if (!aceptado) return;

    setLoading(true);

    try {
      await actualizarPrestador(prestador.id, { activo: !prestador.activo });

      await cargarDatos();

      alertaExito(
        prestador.activo ? "Prestador desactivado" : "Prestador activado",
        prestador.activo
          ? "El prestador ya no recibirá citas nuevas."
          : "El prestador ya está disponible nuevamente.",
      );
    } catch (error) {
      console.error(error);
      alertaError("Error", "No fue posible cambiar el estado del prestador.");
    } finally {
      setLoading(false);
    }
  };

  const abrirCitas = async (prestador) => {
    setPrestadorCitas(prestador);
    setModalCitas(true);
    setLoading(true);

    try {
      const data = await obtenerCitasPrestador(prestador.id);
      setCitasPrestador(data);
    } catch (error) {
      console.error(error);
      alertaError("Error", "No fue posible cargar las citas del prestador.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <EmpresaLayout>
      <LoadingOverlay show={loading} text="Cargando prestadores..." />

      <section className="empresa-prestadores">
        <header className="prestadores-header">
          <div>
            <h1>Prestadores</h1>
            <p>
              Administra a los barberos, estilistas o empleados que atienden
              citas en tu negocio.
            </p>
          </div>
        </header>

        {empresa && !empresa.usa_prestadores && (
          <div className="prestadores-aviso">
            Tu empresa todavía usa una sola agenda general. Pídele a un
            administrador que active "usa prestadores" para que las citas se
            repartan entre los prestadores que registres aquí.
          </div>
        )}

        <div className="prestadores-grid">
          <form className="prestadores-form" onSubmit={handleCrearPrestador}>
            <h2>Nuevo prestador</h2>

            <input
              type="text"
              placeholder="Nombre del prestador"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />

            <label>Servicios que realiza</label>

            <div className="prestadores-servicios-check">
              {servicios.map((servicio) => (
                <label key={servicio.id} className="servicio-check-item">
                  <input
                    type="checkbox"
                    checked={form.servicio_ids.includes(servicio.id)}
                    onChange={() => toggleServicioForm(servicio.id)}
                  />
                  {servicio.nombre}
                </label>
              ))}

              {servicios.length === 0 && (
                <p className="prestadores-empty">
                  Registra primero un servicio para poder asignarlo.
                </p>
              )}
            </div>

            <button type="submit">Agregar prestador</button>
          </form>

          <div className="prestadores-lista">
            <h2>Mis prestadores</h2>

            {prestadores.length === 0 ? (
              <p className="prestadores-empty">No hay prestadores registrados.</p>
            ) : (
              prestadores.map((prestador) => (
                <div className="prestador-card" key={prestador.id}>
                  <div>
                    <h3>{prestador.nombre}</h3>

                    <div className="prestador-meta">
                      <div
                        className={
                          prestador.activo ? "badge-activo" : "badge-inactivo"
                        }
                      >
                        {prestador.activo ? "Activo" : "Inactivo"}
                      </div>

                      {prestador.servicios.length === 0 ? (
                        <span className="badge-info">Sin servicios asignados</span>
                      ) : (
                        prestador.servicios.map((servicio) => (
                          <span className="badge-info" key={servicio.id}>
                            {servicio.nombre}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="prestador-actions">
                    <button className="btn-edit" onClick={() => abrirEditar(prestador)}>
                      Editar
                    </button>

                    <button
                      className="btn-citas"
                      onClick={() => abrirCitas(prestador)}
                    >
                      Ver citas
                    </button>

                    <button
                      className={prestador.activo ? "btn-inactive" : "btn-active"}
                      onClick={() => cambiarEstado(prestador)}
                    >
                      {prestador.activo ? "Desactivar" : "Activar"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {modalEditar && prestadorEditar && (
        <div className="modal-overlay">
          <div className="modal-servicio">
            <h2>Editar prestador</h2>

            <label>Nombre</label>
            <input
              type="text"
              value={prestadorEditar.nombre}
              onChange={(e) =>
                setPrestadorEditar({ ...prestadorEditar, nombre: e.target.value })
              }
            />

            <label>Servicios que realiza</label>

            <div className="prestadores-servicios-check">
              {servicios.map((servicio) => (
                <label key={servicio.id} className="servicio-check-item">
                  <input
                    type="checkbox"
                    checked={prestadorEditar.servicios.some(
                      (s) => s.id === servicio.id,
                    )}
                    onChange={() => toggleServicioEditar(servicio.id)}
                  />
                  {servicio.nombre}
                </label>
              ))}
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setModalEditar(false)}>
                Cancelar
              </button>

              <button className="btn-save" onClick={guardarEdicion}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalCitas && (
        <div className="modal-overlay">
          <div className="modal-servicio modal-citas-prestador">
            <h2>Citas de {prestadorCitas?.nombre}</h2>

            {citasPrestador.length === 0 ? (
              <p className="prestadores-empty">
                Este prestador no tiene citas registradas.
              </p>
            ) : (
              <div className="prestador-citas-lista">
                {citasPrestador.map((cita) => (
                  <div className="prestador-cita-item" key={cita.id}>
                    <div>
                      <strong>{cita.nombre}</strong>
                      <p>{cita.servicio_nombre}</p>
                    </div>

                    <div className="prestador-cita-fecha">
                      <span>{cita.fecha}</span>
                      <span>{cita.hora}</span>
                    </div>

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
                ))}
              </div>
            )}

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setModalCitas(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </EmpresaLayout>
  );
}

export default EmpresaPrestadores;
