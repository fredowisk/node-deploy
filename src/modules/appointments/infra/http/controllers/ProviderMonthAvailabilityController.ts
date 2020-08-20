import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
  // Todo metodo controller retorna uma promise de response.
  // index retorna a listagem de todos.
  public async index(request: Request, response: Response): Promise<Response> {
    // recebendo o id,
    const { provider_id } = request.params;
    // recebendo o mes e o ano do request query
    const { month, year } = request.query;

    // o resolve irá carregar nosso service, e irá verificar se no seu constructor ele está precisando
    // de alguma dependencia, então ele vai até o container e retorna uma instância da classe.
    const listProviderMonthAvailability = container.resolve(
      ListProviderMonthAvailabilityService,
    );

    // passando os parametros para a função execute
    const availability = await listProviderMonthAvailability.execute({
      provider_id,
      month: Number(month),
      year: Number(year),
    });

    return response.json(availability);
  }
}
