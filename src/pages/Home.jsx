import { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { ListaContactos } from "../components/ListaContactos.jsx";


export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const location = useLocation();

  const agendaName = "mi_agenda";
  const apiUrl = `https://playground.4geeks.com/contact/agendas/${agendaName}/contacts`;

  // Crear agenda si no existe
  const AgendaExists = async () => {
    try {
      await fetch(`https://playground.4geeks.com/contact/agendas/${agendaName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: agendaName })
      });
    } catch (error) {
      console.error("No se pudo crear la agenda:", error);
    }
  };

  // Obtener contactos
  const getContacts = async () => {
    await AgendaExists();

    const response = await fetch(apiUrl);
    if (!response.ok) return;
    const data = await response.json();

    const savedAvatars = JSON.parse(localStorage.getItem("avatars") || "{}");

    const contactAvatar = data.contacts.map(contact => {
      if (!contact.id) return null;
      const avatar = contact.avatar || savedAvatars[contact.id] || null;
      if (avatar) savedAvatars[contact.id] = avatar;
      return { ...contact, avatar };
    }).filter(Boolean);

    localStorage.setItem("avatars", JSON.stringify(savedAvatars));
    dispatch({ type: "setContacts", payload: contactAvatar });
  };

  useEffect(() => {
    getContacts();
    if (location.state?.reload) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleEdit = (contact) => {
    if (!contact.id) return alert("No se puede editar un contacto sin ID");
    navigate("/demo", { state: { contact, agendaName } });
  };

  const handleDelete = async (id) => {
    const response = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    if (response.ok) {
      const updatedContacts = store.contacts.filter(c => c.id !== id);
      dispatch({ type: "setContacts", payload: updatedContacts });

      const savedAvatars = JSON.parse(localStorage.getItem("avatars") || "{}");
      delete savedAvatars[id];
      localStorage.setItem("avatars", JSON.stringify(savedAvatars));
    }
  };

  return (
    <div style={{ maxHeight: "80vh", overflowY: "auto", padding: "20px" }}>
      <div className="d-flex align-items-center mb-3">
  <h2 className="text-center flex-grow-1 m-0">Lista de Contactos</h2>
      </div>

      {store.contacts.length === 0 ? (
        <div className="text-center text-muted mt-5" style={{ fontSize: "18px" }}>
          No hay contactos
        </div>
      ) : (
        <ul className="list-group">
          {store.contacts.map(contact => (
            <li
              key={contact.id}
              className="list-group-item d-flex justify-content-center align-items-center"
              style={{ transition: "background 0.2s", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f1f1f1")}
              onMouseLeave={e => (e.currentTarget.style.background = "white")}
            >
              <div
                className="d-grid text-start align-items-center"
                style={{
                  gridTemplateColumns: "80px 150px 250px 150px 250px 120px",
                  gap: "20px",
                  width: "max-content",
                  whiteSpace: "nowrap"
                }}
              >
                <div>
                  {contact.avatar ? (
                    <img
                      src={contact.avatar}
                      alt={contact.name || "contact"}
                      className="rounded-circle"
                      style={{ width: 64, height: 64, objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center bg-secondary text-white"
                      style={{ width: 64, height: 64, fontWeight: "bold", fontSize: "24px" }}
                    >
                      {contact.name ? contact.name[0].toUpperCase() : "?"}
                    </div>
                  )}
                </div>
                <div className="fw-semibold">{contact.name || "Sin nombre"}</div>
                <div>📧 {contact.email}</div>
                <div>☎️ {contact.phone || "—"}</div>
                <div>📍 {contact.address || "—"}</div>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-primary" onClick={() => handleEdit(contact)}>✏️</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(contact.id)}>🗑️</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
