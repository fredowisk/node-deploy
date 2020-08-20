import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

// o describe cria uma categoria.
describe('UpdateProfile', () => {
  beforeEach(() => {
    // estamos passando o fake como parâmetro, pois é solicitado uma variavel que
    // seja igual a interface de appointment.
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    // como o fake salva na memória da aplicação, quando os testes terminam ela é apagada.
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  // isso deve...
  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Fredzika',
      email: 'fredaozika@gmail.com',
      password: '123123123',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Fredim',
      email: 'fredim@gmail.com',
    });

    // eu espero que o user.avatar seja...
    expect(updatedUser.name).toBe('Fredim');
    expect(updatedUser.email).toBe('fredim@gmail.com');
  });

  it('should not be able to update the profile if he not exists', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user-id',
        name: 'test',
        email: 'test@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  // isso deve...
  it('should not be able to change to another user e-mail', async () => {
    await fakeUsersRepository.create({
      name: 'Fredzika',
      email: 'fredaozika@gmail.com',
      password: '123123123',
    });

    const user = await fakeUsersRepository.create({
      name: 'Fred',
      email: 'fred@gmail.com',
      password: '123123123',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Fredim',
        email: 'fredaozika@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Fredzika',
      email: 'fredaozika@gmail.com',
      password: '123123123',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Fredim',
      email: 'fred@gmail.com',
      old_password: '123123123',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Fredzika',
      email: 'fredaozika@gmail.com',
      password: '123123123',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Fredim',
        email: 'fredaozika@gmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Fredzika',
      email: 'fredaozika@gmail.com',
      password: '123123123',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Fredim',
        email: 'fredaozika@gmail.com',
        old_password: 'wrong-old-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
