// src/pages/AdminIntentFlow.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../components/admin/AdminLayout';
import { toast } from 'react-toastify';

function AdminIntentFlow() {
  const [categories, setCategories] = useState([]);
  const [flows, setFlows] = useState([]);
  const [fromCategory, setFromCategory] = useState('');
  const [toCategory, setToCategory] = useState('');

  const CATEGORIES = [
  'informativa',
  'conversacional',
  'solicitud',
  'aclaracion',
  'aprendizaje',
];

  useEffect(() => {
    setCategories(CATEGORIES);
    fetchFlows();
  }, []);

  const fetchFlows = async () => {
    try {
      const res = await axios.get('/api/intent-flows');
      setFlows(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Error al cargar flujos');
    }
  };

  const handleCreateFlow = async () => {
    if (!fromCategory || !toCategory || fromCategory === toCategory) {
      toast.warning('Selecciona dos categorías diferentes');
      return;
    }

    try {
      await axios.post('/api/intent-flows', {
        fromIntent: fromCategory,
        toIntent: toCategory,
      });
      toast.success('Flujo entre categorías creado');
      setFromCategory('');
      setToCategory('');
      fetchFlows();
    } catch {
      toast.error('Error al crear flujo entre categorías');
    }
  };

  const handleDeleteFlow = async (id) => {
    if (!window.confirm('¿Eliminar este flujo?')) return;

    try {
      await axios.delete(`/api/intent-flows/${id}`);
      toast.success('Flujo eliminado');
      fetchFlows();
    } catch {
      toast.error('Error al eliminar flujo');
    }
  };

  return (
    <AdminLayout>
      <div className="container py-4">
        <h2 className="text-center mb-4">🔁 Flujo entre Categorías de Intención para Asistente de análisis de comportamiento humano</h2>
        <div className="card p-4 shadow-sm mb-5">
          <h5>Crear nuevo flujo</h5>
          <div className="row g-3 mt-2">
            <div className="col-md-5">
              <select
                className="form-select"
                value={fromCategory}
                onChange={(e) => setFromCategory(e.target.value)}
              >
                <option value="">Desde categoría...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-5">
              <select
                className="form-select"
                value={toCategory}
                onChange={(e) => setToCategory(e.target.value)}
              >
                <option value="">Hacia categoría...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <button className="btn btn-success w-100" onClick={handleCreateFlow}>
                Crear
              </button>
            </div>
          </div>
        </div>

        <h5>Flujos existentes</h5>
        <ul className="list-group">
          {flows.map((flow) => (
            <li
              key={flow.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {flow.fromIntent} → {flow.toIntent}
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDeleteFlow(flow.id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </AdminLayout>
  );
}

export default AdminIntentFlow;
