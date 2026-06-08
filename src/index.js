const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.json({
    message: 'Hola DevSecOps',
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
  });
});

if (require.main === module) {
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Servidor ejecutándose en puerto ${port}`);
  });
}

module.exports = app;