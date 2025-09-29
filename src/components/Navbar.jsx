import { Link, useLocation, useNavigate } from "react-router-dom";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const inDemo = location.pathname === "/demo";

  const handleCancel = () => {
    navigate("/"); // Vuelve a Home
  };

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Solo se ve el link "Inicio" si estamos en Demo */}
        {inDemo ? (
          <button className="btn btn-link p-0" onClick={() => navigate("/")}>
            Mis contactos
          </button>
        ) : (
          <div></div> // Mantener espacio a la izquierda cuando estamos en Home
        )}

        {/* Botón derecho */}
        <div>
          {inDemo ? (
            <button className="btn btn-danger" onClick={handleCancel}>
              Cancelar
            </button>
          ) : (
            <Link to="/demo">
              <button className="btn btn-primary">Crear Contacto</button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
