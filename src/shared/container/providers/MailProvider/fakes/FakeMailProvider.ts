import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

export default class FakeMailProvider implements IMailProvider {
  // criando um array privado no formato de messagens
  private messages: ISendMailDTO[] = [];

  public async sendMail(message: ISendMailDTO): Promise<void> {
    this.messages.push(message);
  }
}
