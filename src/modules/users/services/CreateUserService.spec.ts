import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUser: CreateUserService;

// o describe cria uma categoria.
describe('CreateUser', () => {
  beforeEach(() => {
    // estamos passando o fake como parâmetro, pois é solicitado uma variavel que
    // seja igual a interface de appointment.
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    // como o fake salva na memória da aplicação, quando os testes terminam ela é apagada.
    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });
  // isso deve...
  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Fredzika',
      email: 'fredaozika@gmail.com',
      password: '123123',
    });

    expect(user).toHaveProperty('id');
  });

  // isso deve...
  it('should not be able to create a new user with same email from another', async () => {
    await createUser.execute({
      name: 'Fredzika',
      email: 'fredaozika@gmail.com',
      password: '123123',
    });

    await expect(
      createUser.execute({
        name: 'Fredzika',
        email: 'fredaozika@gmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});