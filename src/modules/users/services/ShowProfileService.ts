import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
}

@injectable()
class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User> {
    // procurando o usuário...
    const user = await this.usersRepository.findById(user_id);

    // verificando se o usuário foi encontrado...
    if (!user) {
      throw new AppError('User not found');
    }

    return user;
  }
}

export default ShowProfileService;
