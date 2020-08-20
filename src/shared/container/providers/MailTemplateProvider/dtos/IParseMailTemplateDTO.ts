interface ITemplateVariables {
  // essa propriedade pode ter qualquer nome desde que seja uma string,
  // e ela pode receber uma string ou um número.
  [key: string]: string | number;
}

export default interface IParseMailTemplateDTO {
  // o file vai receber o HTML e a variables receberá informações para acrescentar no template
  file: string;
  variables: ITemplateVariables;
}
