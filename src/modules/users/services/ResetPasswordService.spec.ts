import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

// o describe cria uma categoria.
describe('ResetPasswordService', () => {
  // antes de cada teste...
  beforeEach(() => {
    // estamos passando o fake como parâmetro, pois é solicitado uma variavel que
    // seja igual a interface de appointment.
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();
    // como o fake salva na memória da aplicação, quando os testes terminam ela é apagada.

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });
  // isso deve...
  it('should be able to reset the password', async () => {
    // criando um novo usuário
    const user = await fakeUsersRepository.create({
      name: 'Fredzika',
      email: 'fredaozika@gmail.com',
      password: '123123123',
    });
    // gerando um token para este usuário
    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');
    // resetando a senha
    await resetPasswordService.execute({
      password: '123123',
      token,
    });
    // procurando pelo usuário que possua o mesmo id
    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('123123');
    // verificando se o updateUser é undefined utilizando o '?'
    expect(updatedUser?.password).toBe('123123');
  });

  it('should not be able to reset the password with non-existing token', async () => {
    // eu espero que ao tentar resetar a senha utilizando um token inexistente...
    await expect(
      resetPasswordService.execute({
        token: 'non-existing-token',
        password: '123456',
      }), // ela seja rejeitada e seja uma instância de um erro.
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with non-existing user', async () => {
    // criando um token para um usuário inexistente...
    const { token } = await fakeUserTokensRepository.generate(
      'non-existing-user',
    );
    // eu espero que ao tentar resetar a senha utilizando um token de usuário inexistente...
    await expect(
      resetPasswordService.execute({
        token,
        password: '123456',
      }), // ela seja rejeitada e seja uma instância de um erro.
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password if passed more than 2 hours', async () => {
    // criando um novo usuário
    const user = await fakeUsersRepository.create({
      name: 'Fredzika',
      email: 'fredaozika@gmail.com',
      password: '123123123',
    });
    // gerando um token para este usuário
    const { token } = await fakeUserTokensRepository.generate(user.id);
    // espionando o objeto global Date, na sua função 'now'
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    // resetando a senha
    await expect(
      resetPasswordService.execute({
        password: '123123',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
