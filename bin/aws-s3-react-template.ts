#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsS3ReactTemplateStack } from '../lib/aws-s3-react-template-stack';

export type Env = {
  AWS_ACCOUNT_ID: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_DEFAULT_REGION: string;
  S3_BUCKET_NAME: string;
  CODECOMMIT_REPOSITORY_NAME: string;
  STACK_PREFIX: string;
};

const {
  AWS_ACCOUNT_ID,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_DEFAULT_REGION,
  S3_BUCKET_NAME,
  CODECOMMIT_REPOSITORY_NAME,
  STACK_PREFIX
} = process.env as Env;

// Validate Parameters.
if (
  !AWS_ACCOUNT_ID ||
  !AWS_ACCESS_KEY_ID ||
  !AWS_SECRET_ACCESS_KEY ||
  !AWS_DEFAULT_REGION ||
  !S3_BUCKET_NAME ||
  !CODECOMMIT_REPOSITORY_NAME ||
  !STACK_PREFIX
)
  throw new Error('The required parameter has not been specified.');

const app = new cdk.App();
new AwsS3ReactTemplateStack(app, `${STACK_PREFIX}AwsS3ReactTemplateStack`, {
  env: {
    account: AWS_ACCOUNT_ID,
    region: AWS_DEFAULT_REGION
  },
  s3BucketName: S3_BUCKET_NAME,
  codeCommitRepoName: CODECOMMIT_REPOSITORY_NAME
});
