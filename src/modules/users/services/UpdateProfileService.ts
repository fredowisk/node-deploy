import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    old_password,
    password,
  }: IRequest): Promise<User> {
    // procurando o usuário...
    const user = await this.usersRepository.findById(user_id);

    // verificando se o usuário foi encontrado...
    if (!user) {
      throw new AppError('User not found');
    }

    // procurando usuários que possuam este e-mail...
    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    // se um usuário possuir esse e-mail, e possuir um id diferente do que foi recebido...
    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('E-mail already in use.');
    }

    user.name = name;
    user.email = email;

    // se a nova senha existir, mas a antiga não tiver sido informada...
    if (password && !old_password) {
      throw new AppError(
        'You need to inform the old password to set a new password',
      );
    }

    // se a senha estiver preenchida...
    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );
      if (!checkOldPassword) {
        throw new AppError('Old password does not match');
      }
      user.password = await this.hashProvider.generateHash(password);
    }
    // quando vamos retornar uma função assincrona, não precisamos utilizar o await
    // o return já utiliza automaticamente.
    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
