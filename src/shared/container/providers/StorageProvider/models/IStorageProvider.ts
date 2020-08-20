export default interface IStorageProvider {
  // vai receber o caminho do arquivo, e vai devolver o caminho completo de onde ele foi salvo.
  saveFile(file: string): Promise<string>;
  deleteFile(file: string): Promise<void>;
}
