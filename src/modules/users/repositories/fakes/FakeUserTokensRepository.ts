import { uuid } from 'uuidv4';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '../../infra/typeorm/entities/UserToken';

// a classe implementa a interface IUserRepository
class FakeUserTokensRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    // associando os valores ao objeto. Criando um uuid para o id e o token,
    // e atribuindo o valor recebido como parâmetro ao user_id
    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  // sempre que criarmos um metodo find ele pode acabar retornando algo ou undefined.
  public async findByToken(token: string): Promise<UserToken | undefined> {
    // verificando se o token do usuário existe.
    const userToken = this.userTokens.find(user => user.token === token);

    return userToken;
  }
}

export default FakeUserTokensRepository;
