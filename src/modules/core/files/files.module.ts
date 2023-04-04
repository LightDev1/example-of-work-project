import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppFilesController } from './controllers/app-files.controller';
import { LocalFilesFacade } from './facades/local-files-service.facade';
import AppFile from './models/file.entity';
import { AppFilesProvider } from './providers/files.provider';
import { AppFilesService } from './services/files.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([AppFile]),
    MulterModule.register({
      limits: { fileSize: 20971520 },
    }),
  ],
  providers: [AppFilesService, AppFilesProvider, LocalFilesFacade],
  exports: [AppFilesService, LocalFilesFacade],
  controllers: [AppFilesController],
})
export class CoreFilesModule {}
