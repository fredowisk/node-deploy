import { container } from 'tsyringe';
import uploadConfig from '@config/upload';

import IStorageProvider from './models/IStorageProvider';

import DiskStorageProvider from './implementations/DiskStorageProvider';
import S3StorageProvider from './implementations/S3StorageProvider';

const providers = {
  disk: DiskStorageProvider,
  s3: S3StorageProvider,
};

// Toda a vez que minha aplicação precisar de um 'Storageprovider' eu vou mandar ela usar
// um diskStorageProvider...
container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers[uploadConfig.driver],
);
