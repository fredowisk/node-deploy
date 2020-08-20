import ISendMailDTO from '../dtos/ISendMailDTO';

export default interface IMailProvider {
  // o email vai demorar um pouco para ser enviado, por isso ele retornará uma promise.
  sendMail(data: ISendMailDTO): Promise<void>;
}
