import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    // utilizamos o promises para trabalhar com os metodos do node como promises.
    await fs.promises.rename(
      // entrei no diretório temp e peguei o nome do arquivo...
      path.resolve(uploadConfig.tmpFolder, file),
      // e irei move-lo para a pasta uploads.
      path.resolve(uploadConfig.uploadsFolder, file),
    );

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    // encontrando o arquivo.
    const filePath = path.resolve(uploadConfig.uploadsFolder, file);

    try {
      // verificando se o arquivo existe
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    // apagando o arquivo.
    await fs.promises.unlink(filePath);
  }
}
