import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointments from '@modules/appointments/services/ListProviderAppointmentsService';
import { classToClass } from 'class-transformer';

export default class ProviderAppointmentsController {
  // Todo metodo controller retorna uma promise de response.
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;
    const { day, month, year } = request.query;

    // o resolve irá carregar nosso service, e irá verificar se no seu constructor ele está precisando
    // de alguma dependencia, então ele vai até o container e retorna uma instância da classe.
    const listProviderAppointment = container.resolve(ListProviderAppointments);

    const appointments = await listProviderAppointment.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    // modificando as informações que serão retornadas ao usuário
    return response.json(classToClass(appointments));
  }
}
