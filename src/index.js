import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3005;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.status(200).send('Hola mundo, patricia y violeta y su primera API');
});

async function connectDB() {
  const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_DB, MONGO_HOSTNAME } = process.env;

  if (!MONGO_HOSTNAME || !MONGO_DB) {
    console.warn('MONGO_HOSTNAME or MONGO_DB not set; skipping DB connection.');
    return;
  }

  const authPart = MONGO_USERNAME && MONGO_PASSWORD ? `${encodeURIComponent(MONGO_USERNAME)}:${encodeURIComponent(MONGO_PASSWORD)}@` : '';
  const url = `mongodb://${authPart}${MONGO_HOSTNAME}/${MONGO_DB}?authSource=topicosDS`;

  try {
    await mongoose.connect(url);
    console.log('Conectado a la base de datos');
  } catch (err) {
    console.error('Error al conectarse a la base de datos:', err);
  }
}

app.listen(port, async () => {
  await connectDB();
  console.log(`Api corriendo en http://localhost:${port}`);
});

export default app;
