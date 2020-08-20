import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;
let fakeCacheProvider: FakeCacheProvider;

// o describe cria uma categoria.
describe('CreateAppointment', () => {
  beforeEach(() => {
    // estamos passando o fake como parâmetro, pois é solicitado uma variavel que
    // seja igual a interface de appointment.
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    // como o fake salva na memória da aplicação, quando os testes terminam ela é apagada.
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });
  // isso deve...
  it('should be able to create a new appointment', async () => {
    // espiando a função Date.now para saber quando ela será chamada,
    // e setando com o mock uma data no passado, e utilizando o .getTime para retornar um objeto number.
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: 'provider-id',
      user_id: 'user-id',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider-id');
  });

  // isso não deve...
  it('should not be able to create two appointments on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    const appointmentDate = new Date(2020, 4, 10, 13);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: 'provider-id',
      user_id: 'user-id',
    });

    // o teste irá rejeitar caso seja uma instancia do AppError.
    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: 'provider-id',
        user_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    // espiando a função Date.now para saber quando ela será chamada,
    // e setando com o mock uma data no passado, e utilizando o .getTime para retornar um objeto number.
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    // o teste irá rejeitar caso seja uma instancia do AppError.
    await expect(
      createAppointment.execute({
        // criando uma data no passado, para testar se estamos conseguindo criar agendamentos em datas que já se passaram.
        date: new Date(2020, 4, 10, 11),
        provider_id: 'provider-id',
        user_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able an appointment with same user as provider', async () => {
    // espiando a função Date.now para saber quando ela será chamada,
    // e setando com o mock uma data no passado, e utilizando o .getTime para retornar um objeto number.
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    // o teste irá rejeitar caso seja uma instancia do AppError.
    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 13),
        provider_id: 'provider-id',
        user_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able an appointment outside before 8am and after 5pm', async () => {
    // espiando a função Date.now para saber quando ela será chamada,
    // e setando com o mock uma data no passado, e utilizando o .getTime para retornar um objeto number.
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    // o teste irá rejeitar caso seja uma instancia do AppError.
    await expect(
      createAppointment.execute({
        // criando uma data as 7 horas, para ocorrer um erro
        date: new Date(2020, 4, 11, 7),
        provider_id: 'provider-id',
        user_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        // criando uma data as 7 horas, para ocorrer um erro
        date: new Date(2020, 4, 11, 18),
        provider_id: 'provider-id',
        user_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
