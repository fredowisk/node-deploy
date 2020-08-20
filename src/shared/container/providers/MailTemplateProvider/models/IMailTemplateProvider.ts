// sempre que a nossa interface for receber mais de uma informação composta
// devemos criar um DTO
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default interface IMailTemplateProvider {
  parse(data: IParseMailTemplateDTO): Promise<string>;
}
