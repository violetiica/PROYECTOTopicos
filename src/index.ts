import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3005;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

app.get('/', (req: Request, res: Response) => {
  res.send('Hola mundo, patricia y violeta y su primera API 💗');
});

async function connectDB(): Promise<void> {
  const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_DB, MONGO_HOSTNAME } = process.env;

  const envUrl = process.env.MONGO_URL || process.env.MONGO_URI || process.env.mongo_url;

  let url: string | undefined = envUrl;

  if (!url) {
    
    if (!MONGO_HOSTNAME || !MONGO_DB) {
      console.warn('MONGO_HOSTNAME or MONGO_DB not set; skipping DB connection.');
      return;
    }
    

    const authPart = MONGO_USERNAME && MONGO_PASSWORD ? `${encodeURIComponent(MONGO_USERNAME)}:${encodeURIComponent(MONGO_PASSWORD)}@` : '';
    url = `mongodb://${authPart}${MONGO_HOSTNAME}/${MONGO_DB}?authSource=topicosDS`;
  }

  try {
    await mongoose.connect(url, { serverSelectionTimeoutMS: 5000 });
    console.log('Conectado a la base de datos');
  } catch (err: any) {
    console.error('Error al conectarse a la base de datos:', err?.message ?? err);
  }
}

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;

