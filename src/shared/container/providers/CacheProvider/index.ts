import { container } from 'tsyringe';

import ICacheProvider from './models/ICacheProvider';

import RedisCacheProvider from './implementations/RedisCacheProvider';

const providers = {
  redis: RedisCacheProvider,
};

// register instance utiliza o constructor da classe e o singleton não.
container.registerSingleton<ICacheProvider>('CacheProvider', providers.redis);
