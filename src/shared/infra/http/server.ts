import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'express-async-errors';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';
import rateLimiter from './middlewares/rateLimiter';
// utilizando o express
const app = express();
// O cors evita que sites não autorizados utilizem a API.
app.use(cors());
// permitindo que o express use json
app.use(express.json());
// configurações para uploads de imagens
app.use('/files', express.static(uploadConfig.uploadsFolder));
// aplicando o rateLimiter após a rota de imagens, para que ele não impeça elas de
// serem carregadas
// criando limites de requisições
app.use(rateLimiter);
// rotas
app.use(routes);
// utilizando os errors
app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  console.log('Server started on port 3333!');
});
