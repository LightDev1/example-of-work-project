import { ConfigService } from '@nestjs/config';
import { FileProvider } from '../interfaces/FileProvider';
import { promises as fs } from 'fs';
import * as path from 'path';
import { FileProviderFile } from '../interfaces/FileProviderFile';
import { getRandomName } from '../helpers/random-name';
import { Injectable } from '@nestjs/common';
import { UPLOAD_FOLDER } from '../constants/folders';
import { RawFile } from '../interfaces/RawFile';

@Injectable()
export class LocalFilesFacade implements FileProvider {
  constructor(private readonly config: ConfigService) {}

  public async upload(file: RawFile): Promise<FileProviderFile> {
    await this.checkDir(UPLOAD_FOLDER);
    const extension = path.extname(file.originalname);
    const folder = this.resolveFolder(UPLOAD_FOLDER);
    const filePath = path.join(folder, `${getRandomName()}${extension}`);
    const absPath = `.${filePath}`;
    const url = this.getUrl(filePath);
    await this.writeFile()(absPath, file.buffer);
    return { url, key: absPath };
  }
  public delete(filePath: string) {
    return this.removeFile(filePath);
  }

  private readFile() {
    return fs.readFile;
  }

  private writeFile() {
    return fs.writeFile;
  }

  private removeFile(filename: string) {
    return fs.unlink(filename);
  }

  public async mkdirIfNotExists(path: string) {
    if (!(await this.folderExists(path))) {
      await fs.mkdir(path);
    }
  }

  public getUrl(partialPath: string): string {
    const host = this.config.get('APP_HOST');
    return `${host}${partialPath}`;
  }

  public async checkDir(folderName: string) {
    const dirPath = `.${this.resolveFolder(folderName)}`;
    await this.mkdirIfNotExists(dirPath);
  }

  public resolveFolder(folder: string) {
    return path.join('/', folder);
  }

  private async folderExists(path: string): Promise<boolean> {
    return !!(await fs
      .stat(path)
      .then(() => true)
      .catch((err) => false));
  }
}
