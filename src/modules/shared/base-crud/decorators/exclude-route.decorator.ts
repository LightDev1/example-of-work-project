import { SetMetadata } from '@nestjs/common';
export const ExcludeRoute = () => SetMetadata('isExcluded', true);
