// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminChatbotTraining from './pages/AdminChatbotTraining';
import AdminIntentFlow from './pages/AdminIntentFlow';
import AdminInferenceRules from './pages/AdminInferenceRules'; // 👈 NUEVO
import AdminUnknownPhrases from './pages/AdminUnknownPhrases';
import ChatbotWidget from './components/chatbot/ChatbotWidget';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Router>
      <div style={{ height: '100%', width: '100%' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/chatbot-training" element={<AdminChatbotTraining />} />
          <Route path="/admin/intent-flow" element={<AdminIntentFlow />} />
          <Route path="/admin/inference-rules" element={<AdminInferenceRules />} /> {/* 👈 NUEVA RUTA */}
          <Route path="/chatbot" element={<ChatbotWidget />} />
          <Route path="/admin/unknown-phrases" element={<AdminUnknownPhrases />} />
        </Routes>
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
