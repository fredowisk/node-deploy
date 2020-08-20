// Data transfer objects
// Criamos um DTO toda vez que uma informação for ficar se repetindo várias vezes.
export default interface IFindAllInDayFromProviderDTO {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}
