import { container } from 'tsyringe';

import './providers';
import '@modules/users/providers';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';

// utilizamos o register singleton pois ele instancia a classe apenas uma vez durante todo o ciclo da aplicação,
// então todos as próximas requisições feitas utilizarão a mesma instância
// A interface passada no parametro de tipagem garante que o segundo parâmetro será do mesmo tipo dela
container.registerSingleton<IAppointmentsRepository>(
  // o primeiro parâmetro é o ID(NOME), o segundo é o que ele irá retornar.
  'AppointmentsRepository',
  AppointmentsRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  NotificationsRepository,
);
