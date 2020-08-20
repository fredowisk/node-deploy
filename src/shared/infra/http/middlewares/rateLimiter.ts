import { Request, Response, NextFunction } from 'express';
import redis from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import AppError from '@shared/errors/AppError';

// conectando com o banco redis
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
});

// criando um limite de vezes em que o usuário pode criar uma requisição no banco
const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit',
  // ele pode fazer 5 requisições a cada 5 segundos
  points: 5,
  duration: 5,
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // consumindo o ip passado como parâmetro no response
    await limiter.consume(request.ip);

    return next();
  } catch (err) {
    throw new AppError('Too many requests', 429);
  }
}
