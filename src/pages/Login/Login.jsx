import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import "./Login.css";
import logo from "../../assets/logo.png";
import logo2 from "../../assets/logo2.png";
import { login } from "../../services/authServices";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
import { toast } from "react-toastify";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      const usuario = JSON.parse(sessionStorage.getItem("usuario"));

      if (usuario?.rol === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else if (usuario?.rol === "EMPRESA") {
        navigate("/empresa/inicio", { replace: true });
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);
      toast.success("Bienvenido a MOGA 🚀");

      sessionStorage.setItem("token", data.access_token);
      sessionStorage.setItem("usuario", JSON.stringify(data));

      if (data.rol === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/empresa/inicio", { replace: true });
      }
    } catch (error) {
      toast.error("Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <LoadingOverlay show={loading} text="Iniciando sesión..." />
      <section className="login-card">
        <motion.div
          className="login-left"
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          <div className="login-logo">
            <img src={logo2} alt="MOGA" />
          </div>

          <div className="login-content">
            <h1>¡Bienvenido de regreso!</h1>
            <p>Inicia sesión para continuar</p>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-group">
                <label>Correo electrónico</label>

                <div className="login-input-box">
                  <Mail size={18} />

                  <input
                    type="email"
                    placeholder="Ingresa tu correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="login-group">
                <div className="login-label-row">
                  <label>Contraseña</label>
                </div>

                <div className="login-input-box">
                  <Lock size={18} />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="password-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>
              {error && <p className="login-error">{error}</p>}
              <motion.button
                className="login-submit"
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? "Ingresando..." : "Iniciar sesión"} <span>→</span>
              </motion.button>
            </form>
          </div>
        </motion.div>

        <motion.div
          className="login-right"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: "easeOut",
          }}
        >
          <div className="login-right-brand">
            <img src={logo} alt="MOGA" />
          </div>

          <div className="login-line"></div>

          <div className="login-features">
            <div className="login-feature">
              <div className="feature-icon">📞</div>
              <div>
                <h3>Automatización de llamadas</h3>
                <p>Responde, agenda y confirma citas automáticamente con IA.</p>
              </div>
            </div>

            <div className="login-feature">
              <div className="feature-icon">📅</div>
              <div>
                <h3>Agenda inteligente</h3>
                <p>
                  Gestiona todas tus citas en un calendario intuitivo y visual.
                </p>
              </div>
            </div>

            <div className="login-feature">
              <div className="feature-icon">👥</div>
              <div>
                <h3>Gestión de citas</h3>
                <p>Administra clientes, servicios y citas en un solo lugar.</p>
              </div>
            </div>

            <div className="login-feature">
              <div className="feature-icon">🤖</div>
              <div>
                <h3>IA Conversacional</h3>
                <p>Atención 24/7 para tus clientes con nuestra IA avanzada.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

export default Login;
