import * as path from 'path';
import * as dotenv from 'dotenv';

const configsFolderPath = path.resolve(process.cwd(), 'config');
const devDotenvPath = path.resolve(configsFolderPath, `.env.dev`);
const dotenvPath = path.resolve(configsFolderPath, `.env`);

const devConfig = dotenv.config({ path: devDotenvPath }).parsed as Record<
  string,
  string
>;
const envConfig = dotenv.config({ path: dotenvPath }).parsed as Record<
  string,
  string
>;

export function getConfigVariable(key: string): string {
  let value = process.env[key] || envConfig[key] || devConfig[key];
  if (!value) {
    throw new Error(`Config error - missing env.${key}`);
  }
  return value;
}
