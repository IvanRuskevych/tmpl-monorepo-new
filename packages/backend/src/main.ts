import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import 'tsconfig-paths/register.js';
import { ROUTES } from '~/shared/const/index.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

// const CLIENT_URL = process.env.CLIENT_URL;

async function startServer() {
  const app = express();

  app.use(cors({ origin: true, credentials: true })); // origin: CLIENT_URL
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.get(ROUTES.ROOT, (_req, res) => res.send('Hello from ESM!')); // TODO: use for testing

  app.listen(PORT, () => {
    // console.log(`🚀 GraphQL server running at http://localhost:${PORT}${ROUTES.ROOT}`)
    console.log(`🚀 Server running at http://localhost:${PORT}${ROUTES.ROOT}`);
  });
}

startServer().catch(console.error);
