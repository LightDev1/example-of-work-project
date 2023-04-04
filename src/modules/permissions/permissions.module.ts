import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PermissionsService } from './services/permissions.service';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
