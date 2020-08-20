import { ObjectID } from 'mongodb';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';

// a classe implementa a interface IAppointmentsRepository
class FakeNotificationsRepository implements INotificationsRepository {
  // criando um array e começando com ele vazio.
  private notifications: Notification[] = [];

  // Ele irá criar a notification, por isso colocamos ele como parametro na Promise.
  public async create({
    recipient_id,
    content,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    // atribuindo as duas variaveis ao notification.
    Object.assign(notification, { id: new ObjectID(), content, recipient_id });

    this.notifications.push(notification);

    return notification;
  }
}

export default FakeNotificationsRepository;
