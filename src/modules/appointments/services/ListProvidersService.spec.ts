import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

// o describe cria uma categoria.
describe('ListProviders', () => {
  beforeEach(() => {
    // estamos passando o fake como parâmetro, pois é solicitado uma variavel que
    // seja igual a interface de appointment.
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    // como o fake salva na memória da aplicação, quando os testes terminam ela é apagada.
    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });
  // isso deve...
  it('should be able to list the providers', async () => {
    // criando um usuário...
    const user1 = await fakeUsersRepository.create({
      name: 'Fredzika',
      email: 'fredaozika@gmail.com',
      password: '123123123',
    });

    // criando um usuário...
    const user2 = await fakeUsersRepository.create({
      name: 'Fred',
      email: 'fred@gmail.com',
      password: '123123123',
    });

    // criando um usuário logado...
    const loggedUser = await fakeUsersRepository.create({
      name: 'Fredzik',
      email: 'fredaozik@gmail.com',
      password: '123123123',
    });

    // recebendo todos os usuários, exceto o que está logado
    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    // eu espero que dentro de providers tenha os dois usuários.
    expect(providers).toEqual([user1, user2]);
  });
});
