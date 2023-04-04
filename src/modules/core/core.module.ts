import { Module } from '@nestjs/common';
import { CoreConfigModule } from './configs/configs.module';
import { CoreDatabaseModule } from './database/database.module';
import { CoreFilesModule } from './files/files.module';
import { QueuesModule } from './queues/queues.module';

@Module({
  imports: [
    CoreConfigModule,
    CoreDatabaseModule,
    CoreFilesModule,
    QueuesModule,
  ],
})
export class CoreModule {}
