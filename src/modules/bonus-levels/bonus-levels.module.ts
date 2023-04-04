import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonusLevelsController } from './controllers/bonus-levels.controller';
import { BonusLevel } from './models/bonus-level.entity';
import { BonusLevelsService } from './services/bonus-levels.service';

@Module({
  imports: [TypeOrmModule.forFeature([BonusLevel])],
  controllers: [BonusLevelsController],
  providers: [BonusLevelsService],
  exports: [BonusLevelsService],
})
export class BonusLevelsModule {}
