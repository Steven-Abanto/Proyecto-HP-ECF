// src/components/Header/index.jsx (o el archivo que uses)
import { Link, useNavigate } from "react-router-dom";
import "../components.css";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">IdatBank</div>
        <div className="navbar-links">
          <Link to="/accounts">Cuentas</Link>
          <Link to="/transhist">Movimientos</Link>
          <Link to="/loans">Préstamos</Link>
          <Link to="/about">Nosotros</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contacto</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
