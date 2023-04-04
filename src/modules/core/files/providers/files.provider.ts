import { ConfigService } from '@nestjs/config';
import { FILES_PROVIDER } from '../constants/tokens';
import { LocalFilesFacade } from '../facades/local-files-service.facade';

export const AppFilesProvider = {
  provide: FILES_PROVIDER,
  useFactory: async (configService: ConfigService) => {
    return new LocalFilesFacade(configService);
    // return getConfigVariable('NODE_ENV') === 'prod'
    //   ? new S3FilesFacade(configService.get('s3'))
    //   : new LocalFilesFacade(configService);
  },
  inject: [ConfigService],
};
