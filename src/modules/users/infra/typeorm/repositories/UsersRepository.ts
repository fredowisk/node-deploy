import { getRepository, Repository, Not } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';
import User from '../entities/User';

// a classe implementa a interface IUserRepository
class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  // o constructor será executado assim que o repositório for carregado.
  constructor() {
    // o getRepository cria um repositorio, enquanto o getCustomRepository pega um que já existe.
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    // Se o findOne receber apenas um parametro como string, ele já irá pesquisar pelo ID
    // sem necessidade de utilizar o WHERE
    const user = await this.ormRepository.findOne(id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
    });

    return user;
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let users: User[];

    // se o except estiver preenchido...
    if (except_user_id) {
      // procure por todos, menos aqueles que possuem este ID
      users = await this.ormRepository.find({
        where: {
          id: Not(except_user_id),
        },
      });
    } else {
      // se o id não tiver preenchido mostre todos os usuários
      users = await this.ormRepository.find();
    }

    return users;
  }

  // Ele irá criar o user, por isso colocamos ele como parametro na Promise.
  public async create(userData: ICreateUserDTO): Promise<User> {
    const appointment = this.ormRepository.create(userData);

    await this.ormRepository.save(appointment);

    return appointment;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepository;
