import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminLayout from '../components/admin/AdminLayout';

function AdminUnknownPhrases() {
  const [phrases, setPhrases] = useState([]);
  const [editing, setEditing] = useState({}); // Guarda cambios locales

  useEffect(() => {
    fetchPhrases();
  }, []);

  const fetchPhrases = async () => {
    try {
      const res = await axios.get('/api/unknown-phrases');
      setPhrases(res.data);
    } catch (err) {
      toast.error('Error al cargar frases desconocidas');
    }
  };

  const handleChange = (id, field, value) => {
    setEditing((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`/api/unknown-phrases/${id}`, editing[id]);
      toast.success('Frase actualizada');
      fetchPhrases();
    } catch {
      toast.error('Error al actualizar');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta frase desconocida?')) return;
    try {
      await axios.delete(`/api/unknown-phrases/${id}`);
      toast.success('Frase eliminada');
      fetchPhrases();
    } catch {
      toast.error('Error al eliminar');
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-4">🧠 Frases Desconocidas (Aprendizaje)</h2>
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead>
              <tr>
                <th>Frase</th>
                <th>Sesión</th>
                <th>Explicación</th>
                <th>Intención sugerida</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {phrases.map((phrase) => (
                <tr key={phrase.id}>
                  <td>{phrase.phrase}</td>
                  <td>{phrase.sessionId || 'N/A'}</td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={editing[phrase.id]?.explanation ?? phrase.explanation ?? ''}
                      onChange={(e) =>
                        handleChange(phrase.id, 'explanation', e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={editing[phrase.id]?.intentSuggested ?? phrase.intentSuggested ?? ''}
                      onChange={(e) =>
                        handleChange(phrase.id, 'intentSuggested', e.target.value)
                      }
                    />
                  </td>
                  <td className="d-flex gap-2">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleSave(phrase.id)}
                    >
                      Guardar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(phrase.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {phrases.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted">Sin frases desconocidas registradas</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminUnknownPhrases;
