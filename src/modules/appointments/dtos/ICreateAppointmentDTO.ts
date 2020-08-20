// Data transfer objects
// Criamos um DTO toda vez que uma informação for ficar se repetindo várias vezes.
export default interface ICreateAppointmentDTO {
  provider_id: string;
  user_id: string;
  date: Date;
}
