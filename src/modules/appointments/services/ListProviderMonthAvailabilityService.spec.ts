import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

// o describe cria uma categoria.
describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    // estamos passando o fake como parâmetro, pois é solicitado uma variavel que
    // seja igual a interface de appointment.
    // como o fake salva na memória da aplicação, quando os testes terminam ela é apagada.
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });
  // isso deve...
  it('should be able to list the month availability from provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      // criando uma data no ano 2020, mês 5, dia 20, as 8 horas, 0 minutos e 0 segundos.
      date: new Date(2020, 4, 20, 8, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      // criando uma data no ano 2020, mês 5, dia 20, as 9 horas, 0 minutos e 0 segundos.
      date: new Date(2020, 4, 20, 9, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      // criando uma data no ano 2020, mês 5, dia 20, as 10 horas, 0 minutos e 0 segundos.
      date: new Date(2020, 4, 20, 10, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      // criando uma data no ano 2020, mês 5, dia 20, as 11 horas, 0 minutos e 0 segundos.
      date: new Date(2020, 4, 20, 11, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      // criando uma data no ano 2020, mês 5, dia 20, as 12 horas, 0 minutos e 0 segundos.
      date: new Date(2020, 4, 20, 12, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      // criando uma data no ano 2020, mês 5, dia 20, as 13 horas, 0 minutos e 0 segundos.
      date: new Date(2020, 4, 20, 13, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      // criando uma data no ano 2020, mês 5, dia 20, as 14 horas, 0 minutos e 0 segundos.
      date: new Date(2020, 4, 20, 14, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      // criando uma data no ano 2020, mês 5, dia 20, as 15 horas, 0 minutos e 0 segundos.
      date: new Date(2020, 4, 20, 15, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      // criando uma data no ano 2020, mês 5, dia 20, as 16 horas, 0 minutos e 0 segundos.
      date: new Date(2020, 4, 20, 16, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      // criando uma data no ano 2020, mês 5, dia 20, as 17 horas, 0 minutos e 0 segundos.
      date: new Date(2020, 4, 20, 17, 0, 0),
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'provider',
      year: 2020,
      month: 5, // no mês vamos utilizar 5 mas no new Date utilizaremos 4
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
  });
});
