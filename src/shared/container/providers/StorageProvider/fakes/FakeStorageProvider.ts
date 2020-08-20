import IStorageProvider from '../models/IStorageProvider';

export default class FakeStorageProvider implements IStorageProvider {
  private storage: string[] = [];

  public async saveFile(file: string): Promise<string> {
    this.storage.push(file);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const findIndex = this.storage.findIndex(
      storageFile => storageFile === file,
    );

    // splice remove alguma informação do array.
    // eu vou remover 1 informação que está na posição 'findIndex'
    this.storage.splice(findIndex, 1);
  }
}
