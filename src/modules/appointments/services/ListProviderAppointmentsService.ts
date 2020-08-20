import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListProviderAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequest): Promise<Appointment[]> {
    const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

    // pegando as informações
    let appointments = await this.cacheProvider.recover<Appointment[]>(
      cacheKey,
    );

    // se não existir nada no cache...
    if (!appointments) {
      // receba a listagem
      appointments = await this.appointmentsRepository.findAllInDayFromProvider(
        {
          provider_id,
          year,
          month,
          day,
        },
      );
      // salve no cache caso nada seja encontrado.
      // salvando o id com o ano o mes e o dia
      // modificando a maneira que será salva no cache
      await this.cacheProvider.save(cacheKey, classToClass(appointments));
    }

    return appointments;
  }
}

export default ListProviderAppointmentService;
