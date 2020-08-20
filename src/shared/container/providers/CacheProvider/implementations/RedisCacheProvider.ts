import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/cache';
import ICacheProvider from '../models/ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: any): Promise<void> {
    // transformando o value em JSON, pois não sabemos o que virá dentro desta variável
    await this.client.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null> {
    // pegando informações
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }

    // Definindo o retorno do .parse como T, que é o mesmo tipo que será exigido
    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  public async invalidate(key: string): Promise<void> {
    // deletando a chave do banco de dados
    await this.client.del(key);
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    //  procurando por todas as keys que possuam o  prefixo:qualquer coisa
    // ex: providers-list:13231312321
    const keys = await this.client.keys(`${prefix}:*`);

    // quando a gente quer utilizar multiplas operações ao mesmo tempo
    // o pipeline é mais performatico ele não vai bloquear a execução do restante aqui dentro.
    const pipeline = this.client.pipeline();

    // para cada key, exclua ela
    keys.forEach(key => {
      pipeline.del(key);
    });

    // pedindo pro pipeline executar tudo ao mesmo tempo
    await pipeline.exec();
  }
}
