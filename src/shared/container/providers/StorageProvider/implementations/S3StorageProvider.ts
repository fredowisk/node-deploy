import fs from 'fs';
import path from 'path';
import mime from 'mime';
import aws, { S3 } from 'aws-sdk';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

export default class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: process.env.AWS_DEFAULT_REGION,
    });
  }

  public async saveFile(file: string): Promise<string> {
    // entrei no diretório temp e peguei o nome do arquivo...
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    // pegando o tipo da imagem...
    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw new Error('File not found');
    }

    // utilizamos o promises para trabalhar com os metodos do node como promises.
    // lendo o conteudo do arquivo...
    const fileContent = await fs.promises.readFile(originalPath);

    // transformando em uma promise
    await this.client
      .putObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: file, // deixando o arquivo public e legivel.
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      })
      .promise();

    // excluindo o arquivo do disco local pra deixar ele apenas na nuvem
    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: 'app-gobarber-2',
        Key: file,
      })
      .promise();
  }
}
