import { getRepository, Repository } from 'typeorm';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '../entities/UserToken';

// a classe implementa a interface IUserRepository
class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  // o constructor será executado assim que o repositório for carregado.
  constructor() {
    // o getRepository cria um repositorio, enquanto o getCustomRepository pega um que já existe.
    this.ormRepository = getRepository(UserToken);
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    // Se o findOne receber apenas um parametro como string, ele já irá pesquisar pelo ID
    // sem necessidade de utilizar o WHERE
    const userToken = await this.ormRepository.findOne({
      where: { token },
    });

    return userToken;
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = this.ormRepository.create({
      user_id,
    });

    await this.ormRepository.save(userToken);

    return userToken;
  }
}

export default UserTokensRepository;
