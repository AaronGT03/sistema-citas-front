import { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import "./AdminUsuarios.css";
import { Pencil, Trash2 } from "lucide-react";
import { obtenerEmpresas } from "../../../services/empresaService";
import {
    obtenerUsuarios,
    crearUsuario,
    eliminarUsuario,
    editarUsuario
} from "../../../services/usuarioService";

function AdminUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [modoEditar, setModoEditar] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    useEffect(() => {
        cargarUsuarios();
        cargarEmpresas();
    }, []);

    const cargarUsuarios = async () => {
        try {
            const data = await obtenerUsuarios();
            setUsuarios(data);
        } catch (error) {
            console.log(error);
        }
    };
    const handleEliminarUsuario = async (usuarioId) => {
        const confirmar = confirm("¿Deseas eliminar este usuario?");

        if (!confirmar) return;

        try {
            await eliminarUsuario(usuarioId);
            cargarUsuarios();
        } catch (error) {
            alert(
                error.response?.data?.detail ||
                "Error al eliminar usuario"
            );
        }
    };
    const guardarUsuario = async () => {
        try {
            if (modoEditar) {
                await editarUsuario(
                    usuarioSeleccionado.id,
                    formData
                );
            } else {
                await crearUsuario({
                    nombre: formData.nombre,
                    email: formData.email,
                    password: formData.password,
                    rol: "EMPRESA",
                    empresa_id: formData.empresa_id,
                });
            }

            setMostrarModal(false);
            setModoEditar(false);
            setUsuarioSeleccionado(null);

            setFormData({
                nombre: "",
                email: "",
                password: "",
                empresa_id: "",
            });

            cargarUsuarios();
        } catch (error) {
            alert(
                error.response?.data?.detail ||
                "Error al guardar usuario"
            );
        }
    };
    const cargarEmpresas = async () => {
        try {
            const data = await obtenerEmpresas();
            setEmpresas(data);
        } catch (error) {
            console.log(error);
        }
    };
    const [mostrarModal, setMostrarModal] = useState(false);

    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        password: "",
        empresa_id: "",
    });
    const abrirEditarUsuario = (usuario) => {
        setModoEditar(true);
        setUsuarioSeleccionado(usuario);

        setFormData({
            nombre: usuario.nombre,
            email: usuario.email,
            password: "",
            empresa_id: usuario.empresa_id || "",
        });

        setMostrarModal(true);
    };

    return (
        <AdminLayout>
            <section className="admin-usuarios">
                <div className="usuarios-header">
                    <div>
                        <h1>Usuarios</h1>
                        <p>Administra los usuarios del sistema.</p>
                    </div>

                    <button
                        className="usuario-create-btn"
                        onClick={() => setMostrarModal(true)}
                    >
                        + Nuevo usuario
                    </button>
                </div>

                <div className="usuarios-table-card">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Empresa</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id}>
                                    <td>{usuario.nombre}</td>
                                    <td>{usuario.email}</td>

                                    <td>
                                        <span
                                            className={
                                                usuario.rol === "ADMIN" ? "role-admin" : "role-empresa"
                                            }
                                        >
                                            {usuario.rol}
                                        </span>
                                    </td>

                                    <td className="empresa-cell">
                                        {usuario.empresa_nombre || "-"}
                                    </td>
                                    <td>
                                        {usuario.rol === "ADMIN" ? (
                                            <span className="admin-protected">
                                                Protegido
                                            </span>
                                        ) : (
                                            <div className="actions">
                                                <button
                                                    className="edit-btn"
                                                    onClick={() => abrirEditarUsuario(usuario)}
                                                >
                                                    <Pencil size={16} />
                                                </button>

                                                <button
                                                    className="delete-btn"
                                                    onClick={() => handleEliminarUsuario(usuario.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {
                        mostrarModal && (
                            <div className="modal-overlay">
                                <div className="modal">

                                    <h2>
                                        {modoEditar ? "Editar Usuario" : "Nuevo Usuario"}
                                    </h2>
                                    <input
                                        placeholder="Nombre"
                                        value={formData.nombre}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                nombre: e.target.value,
                                            })
                                        }
                                    />

                                    <input
                                        placeholder="Correo"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email: e.target.value,
                                            })
                                        }
                                    />

                                    <input
                                        type="password"
                                        placeholder={
                                            modoEditar
                                                ? "Nueva contraseña (opcional)"
                                                : "Contraseña"
                                        }
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                password: e.target.value,
                                            })
                                        }
                                    />
                                    <select
                                        value={formData.empresa_id}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                empresa_id: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">
                                            Selecciona empresa
                                        </option>

                                        {empresas.map((empresa) => (
                                            <option
                                                key={empresa.id}
                                                value={empresa.id}
                                            >
                                                {empresa.nombre}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="modal-actions">
                                        <button
                                            onClick={() => {
                                                setMostrarModal(false);
                                                setModoEditar(false);
                                                setUsuarioSeleccionado(null);

                                                setFormData({
                                                    nombre: "",
                                                    email: "",
                                                    password: "",
                                                    empresa_id: "",
                                                });
                                            }}
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            onClick={guardarUsuario}
                                        >
                                            Guardar
                                        </button>
                                    </div>

                                </div>
                            </div>
                        )
                    }
                </div>
            </section>
        </AdminLayout>
    );
}

export default AdminUsuarios;
