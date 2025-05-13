const { Engine } = require('json-rules-engine');
const InferenceRule = require('../models/InferenceRule');

async function ejecutarInferencia(facts) {
  const engine = new Engine();

  try {
    const reglas = await InferenceRule.findAll();

    reglas.forEach(regla => {
      engine.addRule({
        conditions: { all: regla.conditions },
        event: {
          type: 'respuesta',
          params: { mensaje: regla.respuesta }
        }
      });
    });

    let resultado = null;

    await engine
      .run(facts)
      .then(events => {
        if (events.length > 0) {
          resultado = events[0].params.mensaje;
        }
      });

    return resultado;

  } catch (error) {
    console.error('❌ Error cargando o ejecutando reglas dinámicas:', error);
    return null;
  }
}

module.exports = {
  ejecutarInferencia
};
