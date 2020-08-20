import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';

// estamos passando o fake como parâmetro, pois é solicitado uma variavel que
// seja igual a interface de appointment.
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
// como o fake salva na memória da aplicação, quando os testes terminam ela é apagada.
let authenticateUser: AuthenticateUserService;

// o describe cria uma categoria.
describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  // isso deve...
  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Fredzika',
      email: 'fredaozika@gmail.com',
      password: '123123',
    });

    const response = await authenticateUser.execute({
      email: 'fredaozika@gmail.com',
      password: '123123',
    });

    expect(response).toHaveProperty('token');
    // esperando que o usuario seja autenticado.
    expect(response.user).toEqual(user);
  });

  it('should not able to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'fredaozika@gmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'Fredzika',
      email: 'fredaozika@gmail.com',
      password: '123123',
    });

    await expect(
      authenticateUser.execute({
        email: 'fredaozika@gmail.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
