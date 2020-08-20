import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

// Criando uma interface array
type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        year,
        month,
        day,
      },
    );

    const hourStart = 8;
    // 10 pois das 8 as 10 só existem 10 horários disponíveis.
    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );

    // pegando a data do mock
    const currentDate = new Date(Date.now());

    // mapeando os 10 horários
    const availability = eachHourArray.map(hour => {
      // procurando se existe algum agendamento neste horário...
      const hasAppointmentInHour = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );
      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour, // verificando se o horário é depois de agora, para apenas marcar agendamentos no futuro.
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate), // retornando o contrário da váriavel
      };
    });
    return availability;
  }
}

export default ListProviderDayAvailabilityService;
