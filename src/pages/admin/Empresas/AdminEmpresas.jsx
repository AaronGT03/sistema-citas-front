import { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import {
  obtenerEmpresas,
  crearEmpresa,
} from "../../../services/empresaService";
import "./AdminEmpresas.css";

function AdminEmpresas() {
  const [empresas, setEmpresas] = useState([]);

  const [mostrarModal, setMostrarModal] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    telefono_twilio: "",
    horario_inicio: "09:00",
    horario_fin: "18:00",
  });

  useEffect(() => {
    cargarEmpresas();
  }, []);

  const cargarEmpresas = async () => {
    try {
      const data = await obtenerEmpresas();
      setEmpresas(data);
    } catch (error) {
      console.log("Error al cargar empresas:", error);
    }
  };

  const guardarEmpresa = async (e) => {
    e.preventDefault();

    try {
      await crearEmpresa(formData);

      setMostrarModal(false);

      setFormData({
        nombre: "",
        telefono_twilio: "",
        horario_inicio: "09:00",
        horario_fin: "18:00",
      });

      cargarEmpresas();
    } catch (error) {
      console.log(error);
      alert("Error al crear empresa");
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
            onClick={() => setMostrarModal(true)}
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
                    <span className="status active">Activa</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {mostrarModal && (
            <div className="modal-overlay">
              <div className="modal-card">
                <h2>Nueva Empresa</h2>

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
                    required
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
                      onClick={() => setMostrarModal(false)}
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
