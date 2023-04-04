import { UnsupportedMediaTypeException } from '@nestjs/common';
import { MulterFile } from '../interfaces/MulterFile';

export function fileMimetypeFilter(...mimetypes: string[]) {
  return (
    req,
    file: MulterFile,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (mimetypes.some((m) => file.mimetype.includes(m))) {
      callback(null, true);
    } else {
      callback(
        new UnsupportedMediaTypeException(
          `File type is not matching: ${mimetypes.join(', ')}`,
        ),
        false,
      );
    }
  };
}
