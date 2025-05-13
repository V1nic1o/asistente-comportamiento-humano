// src/components/admin/AdminLayout.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

function AdminLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <header className="bg-dark text-white py-3 px-4 shadow-sm">
        <h1 className="h4 m-0">Panel de Administración</h1>
      </header>

      <nav className="bg-white px-4 py-2 border-bottom d-flex gap-3">
        <NavLink
          to="/admin/chatbot-training"
          className={({ isActive }) =>
            `nav-link ${isActive ? 'text-primary fw-bold' : 'text-secondary'}`
          }
        >
          Entrenamiento
        </NavLink>
        <NavLink
          to="/admin/intent-flow"
          className={({ isActive }) =>
            `nav-link ${isActive ? 'text-primary fw-bold' : 'text-secondary'}`
          }
        >
          Flujo de Intenciones
        </NavLink>
        <NavLink
          to="/admin/inference-rules"
          className={({ isActive }) =>
            `nav-link ${isActive ? 'text-primary fw-bold' : 'text-secondary'}`
          }
        >
          Reglas de Inferencia
        </NavLink>
      </nav>

      <main className="container-fluid px-4 py-4">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
