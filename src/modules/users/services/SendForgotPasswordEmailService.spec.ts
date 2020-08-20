import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

// o describe cria uma categoria.
describe('SendForgotPasswordEmail', () => {
  // antes de cada teste...
  beforeEach(() => {
    // estamos passando o fake como parâmetro, pois é solicitado uma variavel que
    // seja igual a interface de appointment.
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    // como o fake salva na memória da aplicação, quando os testes terminam ela é apagada.

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });
  // isso deve...
  it('should be able to recover the password using the email', async () => {
    // espionando se a função sendMail foi ativada...
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'Fredzika',
      email: 'fredaozika@gmail.com',
      password: '123123123',
    });

    await sendForgotPasswordEmail.execute({
      email: 'fredaozika@gmail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user password', async () => {
    // espionando se a função sendMail foi ativada...
    jest.spyOn(fakeMailProvider, 'sendMail');
    // o await vem antes do expect e não do sendForgotPasswordEmail
    // espero que este email seja rejeitado, e se torne uma instância de AppError
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'fredaozika@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    // espionando se a função sendMail foi ativada...
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Fredzika',
      email: 'fredaozika@gmail.com',
      password: '123123123',
    });

    await sendForgotPasswordEmail.execute({
      email: 'fredaozika@gmail.com',
    });

    // eu espero que a função generate tenha sido chamada com o id do usuário como parâmetro.
    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
