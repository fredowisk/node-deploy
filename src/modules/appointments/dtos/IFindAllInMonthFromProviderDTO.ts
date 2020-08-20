// Data transfer objects
// Criamos um DTO toda vez que uma informação for ficar se repetindo várias vezes.
export default interface IFindAllInMonthFromProviderDTO {
  provider_id: string;
  month: number;
  year: number;
}
