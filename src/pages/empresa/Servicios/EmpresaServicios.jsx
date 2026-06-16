import { useEffect, useState } from "react";
import EmpresaLayout from "../../../layouts/EmpresaLayout";
import LoadingOverlay from "../../../components/LoadingOverlay/LoadingOverlay";
import {
  obtenerServiciosEmpresa,
  crearServicio,
  actualizarServicio,
} from "../../../services/serviciosService";
import "./EmpresaServicios.css";

import { confirmar, alertaExito, alertaError } from "../../../utils/alerts";

function EmpresaServicios() {
  const usuario = JSON.parse(sessionStorage.getItem("usuario"));
  const [modalEditar, setModalEditar] = useState(false);
  const [servicioEditar, setServicioEditar] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    duracion_minutos: "",
    precio: "",
  });

  const abrirEditar = (servicio) => {
    setServicioEditar(servicio);
    setModalEditar(true);
  };
  const guardarEdicion = async () => {
    setModalEditar(false);

    const aceptado = await confirmar({
      titulo: "Guardar cambios",
      texto: "Los datos del servicio serán actualizados.",
      icono: "question",
      textoConfirmar: "Guardar",
    });

    if (!aceptado){
      setModalEditar(true);
      return;
    }

    setLoading(true);

    try {
      await actualizarServicio(servicioEditar.id, {
        nombre: servicioEditar.nombre,
        descripcion: servicioEditar.descripcion,
        duracion_minutos: Number(servicioEditar.duracion_minutos),
        precio: Number(servicioEditar.precio),
      });

      await cargarServicios();

      alertaExito(
        "Servicio actualizado",
        "Los cambios fueron guardados correctamente.",
      );
    } catch (error) {
      console.error(error);

      setModalEditar(true);

      alertaError("Error", "No fue posible actualizar el servicio.");
    } finally {
      setLoading(false);
    }
  };
  const cargarServicios = async () => {
    setLoading(true);

    try {
      const data = await obtenerServiciosEmpresa(usuario.empresa_id);
      setServicios(data);
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarServicios();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCrearServicio = async (e) => {
    e.preventDefault();

    const aceptado = await confirmar({
      titulo: "Crear servicio",
      texto: "El servicio estará disponible para la empresa.",
      icono: "question",
      textoConfirmar: "Crear",
    });

    if (!aceptado) return;
    
    setLoading(true);

    try {
      await crearServicio({
        nombre: form.nombre,
        descripcion: form.descripcion,
        duracion_minutos: Number(form.duracion_minutos),
        precio: Number(form.precio),
        empresa_id: usuario.empresa_id,
      });

      setForm({
        nombre: "",
        descripcion: "",
        duracion_minutos: "",
        precio: "",
      });

      await cargarServicios();

      alertaExito(
        "Servicio creado",
        "El servicio fue registrado correctamente.",
      );
    } catch (error) {
      console.error(error);

      alertaError("Error", "No fue posible crear el servicio.");
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (servicio) => {
    const aceptado = await confirmar({
      titulo: servicio.activo ? "Desactivar servicio" : "Activar servicio",
      texto: servicio.activo
        ? "Este servicio ya no aparecerá para los clientes por llamada."
        : "Este servicio volverá a estar disponible para los clientes.",
      icono: "warning",
      textoConfirmar: servicio.activo ? "Desactivar" : "Activar",
      colorConfirmar: servicio.activo ? "#ef4444" : "#22c55e",
    });

    if (!aceptado) return;

    setLoading(true);

    try {
      await actualizarServicio(servicio.id, {
        activo: !servicio.activo,
      });

      await cargarServicios();

      alertaExito(
        servicio.activo ? "Servicio desactivado" : "Servicio activado",
        servicio.activo
          ? "El servicio ya no aparecerá en llamadas."
          : "El servicio ya está disponible nuevamente.",
      );
    } catch (error) {
      console.error(error);

      alertaError("Error", "No fue posible cambiar el estado del servicio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <EmpresaLayout>
      <LoadingOverlay show={loading} text="Cargando servicios..." />

      <section className="empresa-servicios">
        <header className="servicios-header">
          <div>
            <h1>Servicios</h1>
            <p>
              Administra los servicios que tus clientes podrán elegir por
              llamada.
            </p>
          </div>
        </header>

        <div className="servicios-grid">
          <form className="servicios-form" onSubmit={handleCrearServicio}>
            <h2>Nuevo servicio</h2>

            <input
              type="text"
              name="nombre"
              placeholder="Nombre del servicio"
              value={form.nombre}
              onChange={handleChange}
              required
            />

            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={form.descripcion}
              onChange={handleChange}
            />

            <input
              type="number"
              name="duracion_minutos"
              placeholder="Duración en minutos"
              value={form.duracion_minutos}
              onChange={handleChange}
            />

            <input
              type="number"
              name="precio"
              placeholder="Precio"
              value={form.precio}
              onChange={handleChange}
            />

            <button type="submit">Agregar servicio</button>
          </form>

          <div className="servicios-lista">
            <h2>Mis servicios</h2>

            {servicios.length === 0 ? (
              <p className="servicios-empty">No hay servicios registrados.</p>
            ) : (
              servicios.map((servicio) => (
                <div className="servicio-card" key={servicio.id}>
                  <div>
                    <h3>{servicio.nombre}</h3>
                    <p>{servicio.descripcion || "Sin descripción"}</p>
                    <div className="servicio-meta">
                      <div className="badge-info">
                        {servicio.duracion_minutos} min
                      </div>

                      <div className="badge-info">${servicio.precio}</div>

                      <div
                        className={
                          servicio.activo ? "badge-activo" : "badge-inactivo"
                        }
                      >
                        {servicio.activo ? "Activo" : "Inactivo"}
                      </div>
                    </div>
                  </div>

                  <div className="servicio-actions">
                    <button
                      className="btn-edit"
                      onClick={() => abrirEditar(servicio)}
                    >
                      Editar
                    </button>
                    <button
                      className={
                        servicio.activo ? "btn-inactive" : "btn-active"
                      }
                      onClick={() => cambiarEstado(servicio)}
                    >
                      {servicio.activo ? "Desactivar" : "Activar"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      {modalEditar && (
        <div className="modal-overlay">
          <div className="modal-servicio">
            <h2>Editar servicio</h2>

            <label>Nombre del servicio</label>
            <input
              type="text"
              value={servicioEditar.nombre}
              onChange={(e) =>
                setServicioEditar({
                  ...servicioEditar,
                  nombre: e.target.value,
                })
              }
            />

            <label>Descripción</label>
            <textarea
              value={servicioEditar.descripcion}
              onChange={(e) =>
                setServicioEditar({
                  ...servicioEditar,
                  descripcion: e.target.value,
                })
              }
            />
            <label>Duración en minutos</label>
            <input
              type="number"
              value={servicioEditar.duracion_minutos}
              onChange={(e) =>
                setServicioEditar({
                  ...servicioEditar,
                  duracion_minutos: e.target.value,
                })
              }
            />

            <label>Precio</label>
            <input
              type="number"
              value={servicioEditar.precio}
              onChange={(e) =>
                setServicioEditar({
                  ...servicioEditar,
                  precio: e.target.value,
                })
              }
            />

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setModalEditar(false)}
              >
                Cancelar
              </button>

              <button className="btn-save" onClick={guardarEdicion}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </EmpresaLayout>
  );
}

export default EmpresaServicios;
