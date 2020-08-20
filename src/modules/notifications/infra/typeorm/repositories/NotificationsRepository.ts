import { getMongoRepository, MongoRepository } from 'typeorm';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

import Notification from '../schemas/Notification';

// a classe implementa a interface IAppointmentsRepository
class NotificationsRepository implements INotificationsRepository {
  // MongoRepository, pois estamos utilizando mongoDB
  private ormRepository: MongoRepository<Notification>;

  // o constructor será executado assim que o repositório for carregado.
  constructor() {
    // getMongoRepository pois é o certo ao utilizar o mongoDB
    // sempre que formos utilizar uma conexão que não seja a default precisamos
    // informar o seu nome no segundo parâmetro.
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  // Ele irá criar a notification, por isso colocamos ele como parametro na Promise.
  public async create({
    recipient_id,
    content,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.ormRepository.create({
      recipient_id,
      content,
    });

    await this.ormRepository.save(notification);

    return notification;
  }
}

export default NotificationsRepository;
