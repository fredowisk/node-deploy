import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

// Criando uma interface array
type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
  }: IRequest): Promise<IResponse> {
    const appointmentsInMonth = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        year,
        month,
      },
    );

    // pegando quantos dias um mês possui
    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    // criando um array com o primeiro parâmetro sendo o total de dias, e o segundo
    // uma função, onde ela recebe o valor da posição do array e o indice dele, começando
    // preenchendo ele com indice + 1 pois não existe dia 0.
    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    // mapeando todos os dias
    const availability = eachDayArray.map(day => {
      // criando uma data com o ano, mes, e o dia que está sendo passado dentro do map
      const compareDate = new Date(year, month - 1, day, 23, 59, 59);
      // verificando se o dia do appointment é igual ao day
      const appointmentsInDay = appointmentsInMonth.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      return {
        day, // verificando se o horário atual é depois da data criada e menor do que 10 horarios
        available:
          isAfter(compareDate, new Date()) && appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
