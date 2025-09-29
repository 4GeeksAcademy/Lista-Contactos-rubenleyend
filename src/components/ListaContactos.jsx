
export const ListaContactos = ()=>{

    return(
        <div style={{ maxHeight: "80vh", overflowY: "auto", padding: "20px" }}>
      {/* Header con botón de crear contacto */}
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
    
}