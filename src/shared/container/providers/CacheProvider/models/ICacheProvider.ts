export default interface ICacheProvider {
  // transformando o value em any, para que ele possa receber qualquer coisa
  save(key: string, value: any): Promise<void>;
  // passando um argumento de tipagem para o recover, fazendo ele retornar a tipagem ou nulo
  recover<T>(key: string): Promise<T | null>;
  invalidate(key: string): Promise<void>;
  // metodo que vai excluir todos os caches que começarem com uma certa string
  // ex: 'providers-list'
  invalidatePrefix(prefix: string): Promise<void>;
}
