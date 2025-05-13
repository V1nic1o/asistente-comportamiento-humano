// src/pages/Home.jsx
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container-fluid py-5" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="text-center mb-5">
        <h1 className="fw-bold display-5">🤖 Asistente Inteligente</h1>
        <p className="lead">Este proyecto usa PLN e inferencia lógica para responder de forma automática.</p>
      </div>

      <div className="row row-cols-1 row-cols-md-2 g-4 justify-content-center">
        <div className="col" style={{ maxWidth: '500px' }}>
          <div className="card shadow-sm h-100 border-0">
            <div className="card-body text-center d-flex flex-column justify-content-between">
              <div>
                <h5 className="card-title">🧠 Entrenar Chatbot</h5>
                <p className="card-text">Crea intenciones, frases y respuestas para entrenar el modelo NLP.</p>
              </div>
              <Link to="/admin/chatbot-training" className="btn btn-primary rounded-pill mt-3">
                Ir al panel de entrenamiento
              </Link>
            </div>
          </div>
        </div>

        <div className="col" style={{ maxWidth: '500px' }}>
          <div className="card shadow-sm h-100 border-0">
            <div className="card-body text-center d-flex flex-column justify-content-between">
              <div>
                <h5 className="card-title">💬 Probar Chatbot</h5>
                <p className="card-text">Interactúa con el chatbot y prueba su comportamiento en tiempo real.</p>
              </div>
              <Link to="/chatbot" className="btn btn-success rounded-pill mt-3">
                Ir al chatbot
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
