import { Controller, Delete, Param, Post, UploadedFile } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FILES_MIMETYPES } from '../constants/files-mimetypes';
import { ApiFile } from '../decorators/app-files.decorator';
import { fileMimetypeFilter } from '../helpers/mimetype-filter';
import AppFile from '../models/file.entity';
import { AppFilesService } from '../services/files.service';
import { ParseFile } from '../validations/parse-file.pipe';

@Controller('files')
@ApiTags('Files')
export class AppFilesController {
  constructor(private readonly service: AppFilesService) {}

  @ApiResponse({ type: AppFile })
  @Post()
  @ApiFile('file', true, {
    fileFilter: fileMimetypeFilter(...FILES_MIMETYPES),
  })
  public create(@UploadedFile(ParseFile) file: any) {
    return this.service.create(file);
  }

  @Delete(':id')
  public delete(@Param('id') appFileId: number) {
    return this.service.delete(appFileId);
  }
}
