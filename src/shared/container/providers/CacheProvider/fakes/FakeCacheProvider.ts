import ICacheProvider from '../models/ICacheProvider';

interface ICacheData {
  // criando um objeto, que a chave é uma string e o valor dele é uma string.
  [key: string]: string;
}

export default class FakeCacheProvider implements ICacheProvider {
  // iniciando o cache como um objeto vazio
  private cache: ICacheData = {};

  public async save(key: string, value: any): Promise<void> {
    // salvando o valor no cache
    this.cache[key] = JSON.stringify(value);
  }

  public async recover<T>(key: string): Promise<T | null> {
    // pegando informações
    const data = this.cache[key];

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  public async invalidate(key: string): Promise<void> {
    // deletando a chave do banco de dados
    delete this.cache[key];
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    // buscando por todas as chaves que comecem com o prefix
    const keys = Object.keys(this.cache).filter(key =>
      key.startsWith(`${prefix}:`),
    );
    // para cada chave, delete ela
    keys.forEach(key => {
      delete this.cache[key];
    });
  }
}
