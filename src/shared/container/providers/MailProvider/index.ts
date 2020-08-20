import { container } from 'tsyringe';
import mailConfig from '@config/mail';

import IMailProvider from './models/IMailProvider';

import EtherialMailProvider from './implementations/EtherialMailProvider';
import SESMailProvider from './implementations/SESMailProvider';

const providers = {
  ethereal: container.resolve(EtherialMailProvider),
  ses: container.resolve(SESMailProvider),
};

// register instance utiliza o constructor da classe e o singleton não.
container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
