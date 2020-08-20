import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointments from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointments;
let fakeCacheProvider: FakeCacheProvider;

// o describe cria uma categoria.
describe('ListProviderAppointments', () => {
  beforeEach(() => {
    // estamos passando o fake como parâmetro, pois é solicitado uma variavel que
    // seja igual a interface de appointment.
    // como o fake salva na memória da aplicação, quando os testes terminam ela é apagada.
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointments = new ListProviderAppointments(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });
  // isso deve...
  it('should be able to list the provider appointments on a specific day', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      // criando uma data no ano 2020, mês 5, dia 20, as 14 horas, 0 minutos e 0 segundos.
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      // criando uma data no ano 2020, mês 5, dia 20, as 15 horas, 0 minutos e 0 segundos.
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    const appointments = await listProviderAppointments.execute({
      provider_id: 'provider',
      year: 2020,
      month: 5,
      day: 20, // no mês vamos utilizar 5 mas no new Date utilizaremos 4
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
