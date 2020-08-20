import { uuid } from 'uuidv4';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

import User from '../../infra/typeorm/entities/User';

// a classe implementa a interface IUserRepository
class FakeUsersRepository implements IUsersRepository {
  // começando com um array vazio
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id);

    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);

    return findUser;
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    // pegando todos os usuários que existem...
    let { users } = this;

    // se o except estiver preenchido, filtre todos os usuários que não tenham o id dele.
    if (except_user_id) {
      users = this.users.filter(user => user.id !== except_user_id);
    }

    return users;
  }

  // Ele irá criar o user, por isso colocamos ele como parametro na Promise.
  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();
    // podemos passar o userData, pois assim ele irá colocar de 1 em 1 dentro do user.
    Object.assign(user, { id: uuid() }, userData);

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return user;
  }
}

export default FakeUsersRepository;
