// todo controller deve ter no maximo 5 funções index, show, create, update, delete.
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateUser.execute({
      email,
      password,
    });
    // o class to class pega uma ou mais entidades e vai aplicar os metodos exigidos nas entities
    // exemplo: @Exclude @Expose
    // neste caso, estamos sumindo com a password e exibindo o avatar.
    return response.json({ user: classToClass(user), token });
  }
}
