import express from 'express';

const app = express();
const PORT = 3005;

app.get('/', (req, res) => {
  res.send('Hola mundo, patricia y violeta y su primera API 💗');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
