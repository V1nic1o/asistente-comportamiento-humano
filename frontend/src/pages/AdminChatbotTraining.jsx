// src/pages/AdminChatbotTraining.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminLayout from '../components/admin/AdminLayout';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';

function AdminChatbotTraining() {
  const [intents, setIntents] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [newType, setNewType] = useState('emocional');
  const [newPhrase, setNewPhrase] = useState('');
  const [newResponse, setNewResponse] = useState('');
  const [selectedIntentId, setSelectedIntentId] = useState(null);
  const [editingPhraseIndex, setEditingPhraseIndex] = useState(null);
  const [editingPhraseText, setEditingPhraseText] = useState('');
  const [expandedIntents, setExpandedIntents] = useState({});

  useEffect(() => {
    fetchIntents();
  }, []);

  const fetchIntents = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/intents');
      setIntents(res.data);
    } catch (err) {
      toast.error('Error al cargar intenciones');
    }
  };

  const handleCreateIntent = async () => {
    if (!newTag.trim()) return;
    try {
      await axios.post('http://localhost:3000/api/intents', {
        tag: newTag,
        phrases: [],
        type: newType,
        response: []
      });
      toast.success('Intención creada');
      setNewTag('');
      setNewType('emocional');
      fetchIntents();
    } catch (err) {
      toast.error('Error al crear intención');
    }
  };

  const handleAddPhrase = async () => {
    if (!newPhrase.trim() || !selectedIntentId) return;
    try {
      await axios.post(`http://localhost:3000/api/intents/${selectedIntentId}/phrases`, {
        phrase: newPhrase
      });
      toast.success('Frase agregada');
      setNewPhrase('');
      fetchIntents();
    } catch (err) {
      toast.error('Error al agregar frase');
    }
  };

  const handleDeleteIntent = async (id) => {
    if (!window.confirm('¿Eliminar esta intención?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/intents/${id}`);
      toast.success('Intención eliminada');
      fetchIntents();
    } catch (err) {
      toast.error('Error al eliminar intención');
    }
  };

  const handleAddResponse = async (intentId) => {
    if (!newResponse.trim()) return;
    const intent = intents.find((i) => i.id === intentId);
    const updatedResponses = [...(intent.response || []), newResponse];
    try {
      await axios.put(`http://localhost:3000/api/intents/${intentId}`, {
        response: updatedResponses
      });
      toast.success('Respuesta agregada');
      setNewResponse('');
      fetchIntents();
    } catch (err) {
      toast.error('Error al agregar respuesta');
    }
  };

  const handleDeleteResponse = async (intentId, index) => {
    const intent = intents.find((i) => i.id === intentId);
    const updatedResponses = intent.response.filter((_, i) => i !== index);
    try {
      await axios.put(`http://localhost:3000/api/intents/${intentId}`, {
        response: updatedResponses
      });
      toast.success('Respuesta eliminada');
      fetchIntents();
    } catch (err) {
      toast.error('Error al eliminar respuesta');
    }
  };

  const handleEditPhrase = async (intentId, index) => {
    const intent = intents.find((i) => i.id === intentId);
    const updatedPhrases = [...intent.phrases];
    updatedPhrases[index] = editingPhraseText;
    try {
      await axios.put(`http://localhost:3000/api/intents/${intentId}`, {
        phrases: updatedPhrases
      });
      toast.success('Frase actualizada');
      setEditingPhraseIndex(null);
      setEditingPhraseText('');
      fetchIntents();
    } catch (err) {
      toast.error('Error al actualizar frase');
    }
  };

  const handleDeletePhrase = async (intentId, index) => {
    const intent = intents.find((i) => i.id === intentId);
    const updatedPhrases = intent.phrases.filter((_, i) => i !== index);
    try {
      await axios.put(`http://localhost:3000/api/intents/${intentId}`, {
        phrases: updatedPhrases
      });
      toast.success('Frase eliminada');
      fetchIntents();
    } catch (err) {
      toast.error('Error al eliminar frase');
    }
  };

  const toggleExpand = (id) => {
    setExpandedIntents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <AdminLayout>
      <div className="container-fluid px-5 py-5">
        <h2 className="text-center mb-5">🧠 Entrenamiento del Asistente de análisis de comportamiento humano</h2>
        <div className="row justify-content-center g-4 mb-5">
          <div className="col-md-6">
            <div className="card p-4 shadow-sm">
              <h5>Crear nueva intención</h5>
              <input
                type="text"
                className="form-control rounded-pill mt-2"
                placeholder="Etiqueta (ej. saludo, cotizar)"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <select
                className="form-select rounded-pill mt-2"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
              >
                <option value="emocional">Emocional</option>
                <option value="contextual">Contextual</option>
                <option value="necesidad">Necesidad</option>
                <option value="flujo">Flujo estructural</option>
              </select>
              <button className="btn btn-success mt-3 rounded-pill" onClick={handleCreateIntent}>
                Crear intención
              </button>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card p-4 shadow-sm">
              <h5>Agregar frase</h5>
              <select
                className="form-select rounded-pill mt-2"
                value={selectedIntentId || ''}
                onChange={(e) => setSelectedIntentId(e.target.value)}
              >
                <option value="">Seleccionar intención</option>
                {intents.map((intent) => (
                  <option key={intent.id} value={intent.id}>{intent.tag}</option>
                ))}
              </select>
              <input
                type="text"
                className="form-control rounded-pill mt-2"
                placeholder="Frase de entrenamiento"
                value={newPhrase}
                onChange={(e) => setNewPhrase(e.target.value)}
              />
              <button className="btn btn-primary mt-3 rounded-pill" onClick={handleAddPhrase}>
                Agregar frase
              </button>
            </div>
          </div>
        </div>

        {intents.map((intent) => (
          <div key={intent.id} className="card mb-4 shadow-sm w-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => toggleExpand(intent.id)}>
                  {expandedIntents[intent.id] ? <BsChevronUp /> : <BsChevronDown />}
                </button>
                <h5 className="mb-0">🏷️ {intent.tag} <span className="badge bg-secondary ms-2">{intent.type}</span></h5>
              </div>
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteIntent(intent.id)}>
                Eliminar intención
              </button>
            </div>

            {expandedIntents[intent.id] && (
              <div className="card-body">
                <h6>🗨️ Frases</h6>
                <ul className="list-group mb-3">
                  {intent.phrases.map((phrase, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                      {editingPhraseIndex === `${intent.id}-${index}` ? (
                        <>
                          <input
                            type="text"
                            className="form-control me-2"
                            value={editingPhraseText}
                            onChange={(e) => setEditingPhraseText(e.target.value)}
                          />
                          <div className="d-flex mt-2 mt-md-0">
                            <button className="btn btn-sm btn-success me-2" onClick={() => handleEditPhrase(intent.id, index)}>✔</button>
                            <button className="btn btn-sm btn-secondary" onClick={() => setEditingPhraseIndex(null)}>✖</button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="me-2">{phrase}</span>
                          <div className="d-flex flex-wrap gap-2 mt-2 mt-md-0">
                            <button className="btn btn-sm btn-outline-primary" onClick={() => {
                              setEditingPhraseIndex(`${intent.id}-${index}`);
                              setEditingPhraseText(phrase);
                            }}>Editar</button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeletePhrase(intent.id, index)}>
                              Eliminar
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>

                <h6>💬 Respuestas (aleatorias)</h6>
                <ul className="list-group mb-3">
                  {(intent.response || []).map((resp, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                      <span>{resp}</span>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteResponse(intent.id, index)}>
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="d-flex">
                  <input
                    type="text"
                    className="form-control rounded-pill me-2"
                    placeholder="Nueva respuesta"
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                  />
                  <button className="btn btn-sm btn-success rounded-pill" onClick={() => handleAddResponse(intent.id)}>
                    Agregar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="mt-5 text-center">
          <button
            className="btn btn-warning rounded-pill px-4 py-2"
            onClick={async () => {
              try {
                await axios.post('http://localhost:3000/api/chatbot/train');
                toast.success('🤖 Modelo entrenado con éxito');
              } catch (err) {
                toast.error('Error al entrenar el modelo');
              }
            }}
          >
            🔁 Entrenar modelo NLP
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminChatbotTraining;
