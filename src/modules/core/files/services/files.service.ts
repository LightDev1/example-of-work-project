import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import { FindManyOptions, Repository } from 'typeorm';
import { FILES_PROVIDER } from '../constants/tokens';
import { FileProvider } from '../interfaces/FileProvider';
import AppFile from '../models/file.entity';
import { RawFile } from '../interfaces/RawFile';
import { fileTypeFromBuffer } from '../utils';
import { format } from 'date-fns';
import { contentType } from 'mime-types';
import { readFile } from 'fs/promises';

@Injectable()
export class AppFilesService {
  constructor(
    @Inject(FILES_PROVIDER)
    private readonly provider: FileProvider,
    @InjectRepository(AppFile)
    private readonly repositoty: Repository<AppFile>,
  ) {}

  public async create(file: RawFile): Promise<AppFile> {
    const providerFile = await this.provider.upload(file);
    const extension = path.extname(file.originalname);
    const title = path.basename(file.originalname, extension);
    const size = file.size;
    const mimeType = file.mimetype;
    return this.repositoty.save({
      ...providerFile,
      extension,
      title,
      size,
      mime_type: mimeType,
    });
  }

  public async delete(id: number): Promise<void> {
    const appFile = await this.repositoty.findOne(id);
    await this.repositoty.remove(appFile);
    await this.provider.delete(appFile.key);
  }

  public findAll(options?: FindManyOptions<AppFile>) {
    return this.repositoty.find(options);
  }

  public findById(id: number) {
    return this.repositoty.findOne(id);
  }

  public getRepo(): Repository<AppFile> {
    return this.repositoty;
  }

  public async createFromBuffer(buffer: RawFile['buffer']): Promise<AppFile> {
    const fileInfo = await fileTypeFromBuffer(buffer);
    const nameFromDate = `${format(new Date(), 'dd-MM-yyy-hh-mm-ss')}.${
      fileInfo.ext
    }`;
    return this.create({
      buffer: buffer,
      filename: nameFromDate,
      mimetype: fileInfo.mime,
      originalname: nameFromDate,
      size: buffer.byteLength,
    });
  }

  public async createForExisting(filePath: string): Promise<AppFile> {
    const file = path.parse(filePath);
    const key = `./${filePath}`;
    const url = await this.provider.getUrl(`/${filePath}`);
    const extension = file.ext;
    const title = file.name;
    const mimeType = contentType(extension);
    const fileBuffer = await readFile(filePath);
    const size = Buffer.byteLength(fileBuffer);

    return this.repositoty.save({
      key,
      url,
      extension,
      title,
      size,
      mime_type: mimeType as any,
    });
  }
}
