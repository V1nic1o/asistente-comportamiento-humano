// src/pages/AdminInferenceRules.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../components/admin/AdminLayout';
import { toast } from 'react-toastify';

function AdminInferenceRules() {
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState({
    conditions: [],
    response: ''
  });
  const [editingId, setEditingId] = useState(null);

  const factOptions = ['intencion', 'emocion', 'contexto', 'situacion', 'detalle'];

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const res = await axios.get('/api/inference-rules');
      setRules(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Error al cargar las reglas');
    }
  };

  const handleChange = (e) => {
    setNewRule({ ...newRule, [e.target.name]: e.target.value });
  };

  const handleConditionChange = (index, field, value) => {
    const updated = [...newRule.conditions];
    updated[index][field] = value;
    setNewRule({ ...newRule, conditions: updated });
  };

  const addCondition = () => {
    setNewRule({
      ...newRule,
      conditions: [...newRule.conditions, { fact: '', operator: 'equal', value: '' }]
    });
  };

  const removeCondition = (i) => {
    const updated = [...newRule.conditions];
    updated.splice(i, 1);
    setNewRule({ ...newRule, conditions: updated });
  };

  const handleSave = async () => {
    if (!newRule.response.trim()) {
      toast.error('La respuesta del bot es obligatoria');
      return;
    }
    if (newRule.conditions.length === 0) {
      toast.error('Agrega al menos una condición');
      return;
    }
    for (let c of newRule.conditions) {
      if (!c.fact || !c.value.trim()) {
        toast.error('Cada condición debe tener un hecho y un valor');
        return;
      }
    }

    try {
      const payload = {
        conditions: newRule.conditions,
        respuesta: newRule.response
      };

      if (editingId) {
        await axios.put(`/api/inference-rules/${editingId}`, payload);
        toast.success('Regla actualizada');
      } else {
        await axios.post('/api/inference-rules', payload);
        toast.success('Regla creada');
      }

      setNewRule({ conditions: [], response: '' });
      setEditingId(null);
      fetchRules();
    } catch (err) {
      console.error('Error al guardar regla:', err.response?.data || err);
      const msg = err.response?.data?.message || 'Error al guardar la regla';
      toast.error(msg);
    }
  };

  const handleEdit = (rule) => {
    setEditingId(rule.id);
    setNewRule({
      conditions: rule.conditions,
      response: rule.respuesta
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta regla?')) return;
    try {
      await axios.delete(`/api/inference-rules/${id}`);
      toast.success('Regla eliminada');
      fetchRules();
    } catch (err) {
      console.error(err);
      toast.error('Error al eliminar la regla');
    }
  };

  return (
    <AdminLayout>
      <div className="container py-4">
        <h2 className="mb-4">Gestión de Reglas de Inferencia para Asistente de análisis de comportamiento humano</h2>
        <div className="alert alert-info">
          Ejemplo: Si <code>emocion</code> es igual a <code>estresado</code>, responder con una técnica de relajación.
        </div>

        <div className="mb-4">
          <h6>Condiciones</h6>
          {newRule.conditions.map((cond, i) => (
            <div key={i} className="d-flex gap-2 mb-2">
              <select
                className="form-select"
                value={cond.fact}
                onChange={(e) => handleConditionChange(i, 'fact', e.target.value)}
              >
                <option value="">Selecciona un hecho</option>
                {factOptions.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>

              <select
                className="form-select"
                value={cond.operator}
                onChange={(e) => handleConditionChange(i, 'operator', e.target.value)}
              >
                <option value="equal">== igual</option>
                <option value="notEqual">!= distinto</option>
                <option value="greaterThan">{'>'} mayor</option>
                <option value="lessThan">{'<' } menor</option>
              </select>

              <input
                type="text"
                className="form-control"
                placeholder="Valor (ej: estresado)"
                value={cond.value}
                onChange={(e) => handleConditionChange(i, 'value', e.target.value)}
              />

              <button className="btn btn-outline-danger" onClick={() => removeCondition(i)}>
                ✕
              </button>
            </div>
          ))}

          <button className="btn btn-outline-primary mb-3" onClick={addCondition}>
            + Agregar Condición
          </button>

          <textarea
            name="response"
            placeholder="Respuesta del bot"
            className="form-control mb-3"
            rows="2"
            value={newRule.response}
            onChange={handleChange}
          />

          <button className="btn btn-success" onClick={handleSave}>
            {editingId ? 'Actualizar Regla' : 'Crear Regla'}
          </button>
        </div>

        <hr />

        <h4>Reglas existentes</h4>
        {rules.length === 0 ? (
          <p>No hay reglas registradas.</p>
        ) : (
          <ul className="list-group">
            {rules.map((r) => (
              <li key={r.id} className="list-group-item d-flex justify-content-between align-items-start">
                <div>
                  <strong>Condiciones:</strong>
                  <pre className="mb-1 small">{JSON.stringify(r.conditions, null, 2)}</pre>
                  <em>Respuesta: {r.respuesta}</em>
                </div>
                <div className="btn-group">
                  <button className="btn btn-sm btn-primary" onClick={() => handleEdit(r)}>Editar</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.id)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminInferenceRules;
