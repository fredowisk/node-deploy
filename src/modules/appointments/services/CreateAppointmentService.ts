import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

// Esta classe é injetavel, ela pode receber injeção de dependências.
@injectable()
class CreateAppointmentService {
  // Se digitarmos private no parametro do constructor ele irá criar a variavel, sem precisar declarar.
  constructor(
    // Injetando o appointments
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    date,
    provider_id,
    user_id,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    // se essa data for antes da data que foi mockada...
    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointment on a past date");
    }

    // verificando se o usuário tem o mesmo id do provider
    if (user_id === provider_id) {
      throw new AppError("You can't create an appointment with yourself");
    }

    // verificando se o horário está entre as 8 ou as 17
    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        'You can only create appointments between 8am and 5pm',
      );
    }

    // procurando se existem agendamentos nesta data e com um certo prestador
    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id,
    );

    // verificando se foi encontrado um agendamento nesta data
    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    // criando o agendamento.
    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    // formatando a data para utiliza-la no content
    // utilizamos as aspas simples para escapar o 'às' do meio das datas
    const dateFormated = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      // para quem iremos enviar essa notificação...
      recipient_id: provider_id,
      // conteudo da notificação
      content: `Novo agendamento para dia ${dateFormated}`,
    });

    await this.cacheProvider.invalidate(
      // formatando a data, para encontrar no banco
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        // utilizando M e d para não acrescentar um 0 no inicio deles.
        'yyyy-M-d',
      )}`,
    );

    return appointment;
  }
}

export default CreateAppointmentService;
