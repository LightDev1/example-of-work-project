import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminAuthModule } from './modules/admin/auth/auth.module';
import { AuthModule } from './modules/auth/auth.module';
import { BonusLevelsModule } from './modules/bonus-levels/bonus-levels.module';
import { CardStatisticsModule } from './modules/card-statistics/card-statistics.module';
import { CardsModule } from './modules/cards/cards.module';
import { ClientCardsModule } from './modules/client-cards/client-cards.module';
import { CoreModule } from './modules/core/core.module';
import { CountriesModule } from './modules/countries/countries.module';
import { OperationsModule } from './modules/operations/operations.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { OwnerAuthModule } from './modules/owner/auth/auth.module';
import { OwnerCardsModule } from './modules/owner/cards/cards.module';
import { OwnerClientCardsModule } from './modules/owner/client-cards/client-cards.module';
import { OwnerUsersModule } from './modules/owner/users/users.module';
import { UsersModule } from './modules/users/users.module';
import { AdminUsersModule } from './modules/admin/users/users.module';
import { ClientClientCardsModule } from './modules/client/client-cards/client-cards.module';
import { AdminCardsModule } from './modules/admin/cards/cards.module';
import { AdminClientCardsModule } from './modules/admin/client-cards/client-cards.module';
@Module({
  imports: [
    CoreModule,
    UsersModule,
    CountriesModule,
    AuthModule,
    CardsModule,
    BonusLevelsModule,
    ClientCardsModule,
    OperationsModule,
    CardStatisticsModule,
    TasksModule,
    ScheduleModule.forRoot(),
    AdminAuthModule,
    OwnerAuthModule,
    OwnerCardsModule,
    OwnerUsersModule,
    OwnerClientCardsModule,
    AdminUsersModule,
    ClientClientCardsModule,
    AdminCardsModule,
    AdminClientCardsModule,
  ],
})
export class AppModule {}
