import {
  ObjectID,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
} from 'typeorm';

@Entity('notifications')
class Notification {
  // o objectId é um id específico do mongo DB
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  content: string;

  @Column('uuid')
  recipient_id: string;

  // no mongo não teremos migrations, então não conseguiremos definir a nivel de banco de dados
  // o valor padrão, tudo será definido na aplicação, não existe nada configurado pelo lado do mongo.
  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Notification;
