// src/components/chatbot/ChatbotWidget.jsx
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './ChatbotWidget.css';

function ChatbotWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);

  const getSessionId = () => {
    let sessionId = localStorage.getItem('chat_session_id');
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('chat_session_id', sessionId);
    }
    return sessionId;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    const sessionId = getSessionId();

    setMessages((prev) => [...prev, { from: 'user', text: userMessage }]);
    setInput('');

    try {
      const res = await axios.post('http://localhost:3000/api/chatbot/message', {
        message: userMessage,
        sessionId,
        emocion: 'tristeza' // puede cambiarse dinámicamente más adelante
      });

      const answer =
        res.data?.answer ||
        res.data?.response ||
        res.data?.mensaje ||
        '⚠️ Lo siento, no entendí tu mensaje.';

      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: answer }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: '⚠️ Error al procesar el mensaje. Intenta nuevamente.' }
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem'
      }}
    >
      <div
        className="chatbot-box shadow rounded d-flex flex-column"
        style={{
          width: '100%',
          maxWidth: '1000px',
          minHeight: '600px',
          backgroundColor: '#fff',
          display: 'flex'
        }}
      >
        <div className="chatbot-header bg-primary text-white p-3 fw-bold text-center rounded-top">
          🤖 Asistente de análisis de comportamiento humano
        </div>

        <div
          className="chatbot-body flex-grow-1 p-3 overflow-auto"
          ref={chatRef}
          style={{ maxHeight: '60vh' }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chatbot-msg ${msg.from} mb-2 p-2 rounded`}
              style={{
                backgroundColor: msg.from === 'user' ? '#e0f7fa' : '#f1f1f1',
                alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}
            >
              {typeof msg.text === 'string'
                ? msg.text
                : typeof msg.text?.mensaje === 'string'
                ? msg.text.mensaje
                : '[Respuesta no disponible]'}
            </div>
          ))}
        </div>

        <div className="chatbot-footer d-flex p-3 border-top bg-white">
          <input
            type="text"
            placeholder="Escribe tu mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="form-control rounded-pill"
          />
          <button
            className="btn btn-success ms-2 rounded-pill"
            onClick={sendMessage}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatbotWidget;
