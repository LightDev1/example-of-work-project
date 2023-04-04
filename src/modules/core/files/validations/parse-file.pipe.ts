import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { MulterFile } from '../interfaces/MulterFile';

@Injectable()
export class ParseFile implements PipeTransform {
  transform(
    files: MulterFile | MulterFile[],
    metadata: ArgumentMetadata,
  ): MulterFile | MulterFile[] {
    if (files === undefined || files === null) {
      throw new BadRequestException('Validation failed (file expected)');
    }

    if (Array.isArray(files) && files.length === 0) {
      throw new BadRequestException('Validation failed (files expected)');
    }

    return files;
  }
}
