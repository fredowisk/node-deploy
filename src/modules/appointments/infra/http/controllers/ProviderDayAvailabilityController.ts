import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
  // Todo metodo controller retorna uma promise de response.
  // index retorna a listagem de todos.
  public async index(request: Request, response: Response): Promise<Response> {
    // recebendo o id
    const { provider_id } = request.params;
    // recebendo o mes e o ano do request query, ex:
    // GET http://localhost:3333/rota?year=2020&month=5&day=20
    const { day, month, year } = request.query;

    // o resolve irá carregar nosso service, e irá verificar se no seu constructor ele está precisando
    // de alguma dependencia, então ele vai até o container e retorna uma instância da classe.
    const listProviderDayAvailability = container.resolve(
      ListProviderDayAvailabilityService,
    );

    // passando os parametros para a função execute e os transformando em números
    const availability = await listProviderDayAvailability.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    return response.json(availability);
  }
}
