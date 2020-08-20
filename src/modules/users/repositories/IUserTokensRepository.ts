import UserToken from '../infra/typeorm/entities/UserToken';

export default interface IUserTokensRepository {
  // gerar um token para um usuário
  generate(user_id: string): Promise<UserToken>;
  findByToken(token: string): Promise<UserToken | undefined>;
}
