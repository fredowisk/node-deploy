import { injectable, inject } from 'tsyringe';
// import { differenceInHours } from 'date-fns';
import { isAfter, addHours } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exists.');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exists.');
    }

    const tokenCreatedAt = userToken.created_at;
    // atribuindo a hora de criação do token e + 2
    const compareDate = addHours(tokenCreatedAt, 2);

    // se a data atual já passou do limite de horas do token, vou disparar um erro.
    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired');
    }

    // if (differenceInHours(Date.now(), tokenCreatedAt) > 2) {
    //   throw new AppError('Token expired');
    // }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
