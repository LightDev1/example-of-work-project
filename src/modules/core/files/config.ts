import { getConfigVariable } from '../configs/helpers';

export const getS3Config = () => ({
  AWS_REGION: getConfigVariable('AWS_REGION'),
  AWS_ACCESS_KEY_ID: getConfigVariable('AWS_ACCESS_KEY_ID'),
  AWS_SECRET_ACCESS_KEY: getConfigVariable('AWS_SECRET_ACCESS_KEY'),
  AWS_PUBLIC_BUCKET_NAME: getConfigVariable('AWS_PUBLIC_BUCKET_NAME'),
});
