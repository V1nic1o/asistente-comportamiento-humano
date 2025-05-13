// src/index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const sequelize = require('./config/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Log de peticiones (opcional)

// Rutas
const intentRoutes = require('./routes/intent.routes');
const chatbotRoutes = require('./routes/chatbot.routes');
const intentFlowRoutes = require('./routes/intentFlow.routes');
const inferenceRoutes = require('./routes/inferenceRule.routes');

app.use('/api/intents', intentRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/intent-flows', intentFlowRoutes);
app.use('/api/inference-rules', inferenceRoutes);

// Fallback de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Conexión y arranque
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');

    // await sequelize.sync(); // Solo si no usas migraciones

    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error al conectar a la base de datos:', err);
  }
}

startServer();
