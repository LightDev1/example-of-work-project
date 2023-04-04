import { FileProviderFile } from './FileProviderFile';
import { RawFile } from './RawFile';

export interface FileProvider {
  upload: (file: RawFile) => Promise<FileProviderFile>;
  delete: (key: string) => Promise<void>;
  getUrl: (partialPath: string) => string;
}
