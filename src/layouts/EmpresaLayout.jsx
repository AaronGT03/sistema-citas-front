import EmpresaSidebar from "../components/EmpresaSidebar/EmpresaSidebar";
import "./EmpresaLayout.css";

function EmpresaLayout({ children }) {
  return (
    <div className="empresa-layout">
      <EmpresaSidebar />

      <main className="empresa-main">
        {children}
      </main>
    </div>
  );
}

export default EmpresaLayout;