// Toda vez que um arquivo começar com a letra I o unico objetivo dele é retornar uma interface
import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '../dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '../dtos/IFindAllInDayFromProviderDTO';
// a interface possui a função findByDate que recebe uma data e retorna uma Promise
// que pode ser um appointment ou undefined.
export default interface IAppointmentsRepository {
  // o metodo create já irá criar e salvar ao mesmo tempo, portanto ele retorna um Appointment
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
  findAllInMonthFromProvider(
    data: IFindAllInMonthFromProviderDTO,
  ): Promise<Appointment[]>;
  findAllInDayFromProvider(
    data: IFindAllInDayFromProviderDTO,
  ): Promise<Appointment[]>;
}
