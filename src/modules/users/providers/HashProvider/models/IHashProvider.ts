export default interface IHashProvider {
  // payload pode ser qualquer coisa(uma informação qualquer)
  // ele vai retornar uma Promise para que possa ser async.
  generateHash(payload: string): Promise<string>;
  // comparar um texto qualquer com algo que já foi criptografado.
  compareHash(payload: string, hashed: string): Promise<boolean>;
}
