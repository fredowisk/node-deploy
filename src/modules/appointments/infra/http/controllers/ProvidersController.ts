import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

export default class ProvidersController {
  // Todo metodo controller retorna uma promise de response.
  // index retorna a listagem de todos.
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    // o resolve irá carregar nosso service, e irá verificar se no seu constructor ele está precisando
    // de alguma dependencia, então ele vai até o container e retorna uma instância da classe.
    const listProviders = container.resolve(ListProvidersService);

    const providers = await listProviders.execute({
      user_id,
    });

    return response.json(classToClass(providers));
  }
}
