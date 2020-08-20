// todo controller deve ter no maximo 5 funções index, show, create, update, delete.
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  // exibição do perfil
  public async show(request: Request, response: Response): Promise<Response> {
    // pegando o id do usuário autenticado
    const user_id = request.user.id;

    // injetando...
    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.execute({ user_id });

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    // pegando o id de um usuário autenticado.
    const user_id = request.user.id;
    const { name, email, old_password, password } = request.body;

    const updateProfile = container.resolve(UpdateProfileService);

    // atualizando informações
    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      old_password,
      password,
    });

    // deletando a senha, para ela não aparecer pro usuário
    return response.json(classToClass(user));
  }
}
