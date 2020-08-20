import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

// o describe cria uma categoria.
describe('UpdateProfile', () => {
  beforeEach(() => {
    // estamos passando o fake como parâmetro, pois é solicitado uma variavel que
    // seja igual a interface de appointment.
    fakeUsersRepository = new FakeUsersRepository();
    // como o fake salva na memória da aplicação, quando os testes terminam ela é apagada.
    showProfile = new ShowProfileService(fakeUsersRepository);
  });
  // isso deve...
  it('should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Fredzika',
      email: 'fredaozika@gmail.com',
      password: '123123123',
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('Fredzika');
    expect(profile.email).toBe('fredaozika@gmail.com');
  });

  it('should not be able to show the profile if he not exists', async () => {
    await expect(
      showProfile.execute({
        user_id: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
