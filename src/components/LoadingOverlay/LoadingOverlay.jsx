import { PacmanLoader } from "react-spinners";
import "./LoadingOverlay.css";

function LoadingOverlay({ show, text = "Cargando..." }) {
  if (!show) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-box">
        <PacmanLoader color="#eaeb12" size={28} speedMultiplier={2} />
        <p>{text}</p>
      </div>
    </div>
  );
}

export default LoadingOverlay;