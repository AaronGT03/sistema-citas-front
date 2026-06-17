import { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import {
  obtenerEmpresas,
  crearEmpresa,
  editarEmpresa,
  eliminarEmpresa,
} from "../../../services/empresaService";
import "./AdminEmpresas.css";
import { Pencil, Trash2 } from "lucide-react";
import {
  confirmar,
  alertaExito,
  alertaError,
} from "../../../utils/alerts";

function AdminEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [modoEditar, setModoEditar] = useState(false);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    telefono_twilio: "",
    horario_inicio: "09:00",
    horario_fin: "18:00",
    activa: true,
  });

  useEffect(() => {
    cargarEmpresas();
  }, []);

  const limpiarFormulario = () => {
    setModoEditar(false);
    setEmpresaSeleccionada(null);

    setFormData({
      nombre: "",
      telefono_twilio: "",
      horario_inicio: "09:00",
      horario_fin: "18:00",
      activa: true,
    });
  };

  const cargarEmpresas = async () => {
    try {
      const data = await obtenerEmpresas();
      setEmpresas(data);
    } catch (error) {
      console.error(error);
      alertaError("Error", "No fue posible cargar las empresas.");
    }
  };

  const abrirNuevaEmpresa = () => {
    limpiarFormulario();
    setMostrarModal(true);
  };

  const guardarEmpresa = async (e) => {
    e.preventDefault();

    setMostrarModal(false);

    const aceptado = await confirmar({
      titulo: modoEditar ? "Guardar cambios" : "Crear empresa",
      texto: modoEditar
        ? "Los datos de la empresa serán actualizados."
        : "Se registrará una nueva empresa en el sistema.",
      icono: "question",
      textoConfirmar: modoEditar ? "Guardar" : "Crear empresa",
    });

    if (!aceptado) {
      setMostrarModal(true);
      return;
    }

    try {
      if (modoEditar) {
        await editarEmpresa(empresaSeleccionada.id, formData);

        alertaExito(
          "Empresa actualizada",
          "Los cambios fueron guardados correctamente."
        );
      } else {
        await crearEmpresa(formData);

        alertaExito(
          "Empresa creada",
          "La empresa fue registrada correctamente."
        );
      }

      limpiarFormulario();
      await cargarEmpresas();
    } catch (error) {
      console.error(error);

      setMostrarModal(true);

      alertaError(
        "Error",
        modoEditar
          ? "No fue posible actualizar la empresa."
          : "No fue posible crear la empresa."
      );
    }
  };

  const abrirEditarEmpresa = (empresa) => {
    setModoEditar(true);
    setEmpresaSeleccionada(empresa);

    setFormData({
      nombre: empresa.nombre,
      telefono_twilio: empresa.telefono_twilio,
      horario_inicio: empresa.horario_inicio,
      horario_fin: empresa.horario_fin,
      activa: empresa.activa,
    });

    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    limpiarFormulario();
  };

  const handleEliminarEmpresa = async (empresaId) => {
    const aceptado = await confirmar({
      titulo: "Eliminar empresa",
      texto:
        "Esta acción eliminará la empresa del sistema. Si tiene citas, usuarios o servicios asociados, puede causar problemas.",
      icono: "warning",
      textoConfirmar: "Sí, eliminar",
      colorConfirmar: "#ef4444",
    });

    if (!aceptado) return;

    try {
      await eliminarEmpresa(empresaId);

      alertaExito(
        "Empresa eliminada",
        "La empresa fue eliminada correctamente."
      );

      await cargarEmpresas();
    } catch (error) {
      console.error(error);

      alertaError(
        "Error",
        "No fue posible eliminar la empresa. Puede tener información asociada."
      );
    }
  };

  return (
    <AdminLayout>
      <section className="admin-empresas">
        <div className="empresas-header">
          <div>
            <h1>Empresas</h1>
            <p>Administra las empresas registradas en MOGA.</p>
          </div>

          <button
            className="empresa-create-btn"
            onClick={abrirNuevaEmpresa}
          >
            + Nueva empresa
          </button>
        </div>

        <div className="empresas-table-card">
          <table>
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Teléfono Twilio</th>
                <th>Horario</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {empresas.map((empresa) => (
                <tr key={empresa.id}>
                  <td>{empresa.nombre}</td>
                  <td>{empresa.telefono_twilio}</td>
                  <td>
                    {empresa.horario_inicio} - {empresa.horario_fin}
                  </td>
                  <td>
                    <span
                      className={
                        empresa.activa ? "status active" : "status inactive"
                      }
                    >
                      {empresa.activa ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className="edit-btn"
                        onClick={() => abrirEditarEmpresa(empresa)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleEliminarEmpresa(empresa.id)
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {mostrarModal && (
            <div className="modal-overlay">
              <div className="modal-card">
                <h2>{modoEditar ? "Editar Empresa" : "Nueva Empresa"}</h2>

                <form onSubmit={guardarEmpresa}>
                  <input
                    type="text"
                    placeholder="Nombre de la empresa"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nombre: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    type="text"
                    placeholder="Número Twilio"
                    value={formData.telefono_twilio}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        telefono_twilio: e.target.value,
                      })
                    }
                    
                  />

                  <div className="time-grid">
                    <div>
                      <label>Horario inicio</label>

                      <input
                        type="time"
                        value={formData.horario_inicio}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            horario_inicio: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label>Horario fin</label>

                      <input
                        type="time"
                        value={formData.horario_fin}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            horario_fin: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={cerrarModal}
                    >
                      Cancelar
                    </button>

                    <button type="submit" className="btn-save">
                      Guardar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </AdminLayout>
  );
}

export default AdminEmpresas;