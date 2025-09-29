import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function Demo() {
  const location = useLocation();
  const navigate = useNavigate();

  const agendaName = location.state?.agendaName || "mi_agenda";
  const initialContact = location.state?.contact || { name: "", email: "", phone: "", address: "" };
  const [contact, setContact] = useState(initialContact);

  const apiUrl = `https://playground.4geeks.com/contact/agendas/${agendaName}/contacts`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contact.name || !contact.email || !contact.phone || !contact.address) return;

    try {
      let response;
      if (contact.id) {
        // Editar contacto existente
        response = await fetch(`${apiUrl}/${contact.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", accept: "application/json" },
          body: JSON.stringify({
            name: contact.name,
            phone: contact.phone,
            email: contact.email,
            address: contact.address
          })
        });
      } else {
        // Crear nuevo contacto
        response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", accept: "application/json" },
          body: JSON.stringify(contact)
        });
      }

      if (response.ok) {
        navigate("/", { state: { reload: true } });
      } else {
        console.error("Error al guardar contacto:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ minWidth: "350px", maxWidth: "500px", width: "100%" }}>
        <h2 className="text-center mb-4">{contact.id ? "Editar Contacto" : "Crear Contacto"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nombre:</label>
            <input type="text" name="name" id="name" className="form-control" value={contact.name} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo:</label>
            <input type="email" name="email" id="email" className="form-control" value={contact.email} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Teléfono:</label>
            <input type="text" name="phone" id="phone" className="form-control" value={contact.phone} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">Dirección:</label>
            <input type="text" name="address" id="address" className="form-control" value={contact.address} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            {contact.id ? "Actualizar Contacto" : "Agregar Contacto"}
          </button>
        </form>
      </div>
    </div>
  );
}
