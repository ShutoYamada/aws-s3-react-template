import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { RemovalPolicy } from 'aws-cdk-lib';
import { BlockPublicAccess, BucketAccessControl } from 'aws-cdk-lib/aws-s3';

interface AwsS3ReactTemplateStackProps extends cdk.StackProps {
  /** S3 Bucket Name */
  s3BucketName: string;
  /** CodeCommit Repository Name */
  codeCommitRepoName: string;
}

export class AwsS3ReactTemplateStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: AwsS3ReactTemplateStackProps
  ) {
    super(scope, id, props);

    // Create S3 bucket.
    const s3Bucket = new s3.Bucket(this, 'MyS3Bucket', {
      bucketName: props.s3BucketName,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL
    });

    // Set a policy to publish an S3 bucket as a static site.
    s3Bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.AnyPrincipal()],
        actions: ['s3:GetObject'],
        resources: [s3Bucket.arnForObjects('*')]
      })
    );

    // Create a CodeCommit repository
    const codeCommitRepo = new codecommit.Repository(this, 'MyCodeCommitRepo', {
      repositoryName: props.codeCommitRepoName
    });

    // Create a CodePipeline.
    const pipeline = new codepipeline.Pipeline(this, 'MyPipeline');

    const sourceOutput = new codepipeline.Artifact();
    const buildOutput = new codepipeline.Artifact();

    // Add action to get source from CodeCommit.
    const sourceAction = new codepipeline_actions.CodeCommitSourceAction({
      actionName: 'Source',
      repository: codeCommitRepo,
      output: sourceOutput,
      branch: 'master',
      runOrder: 1
    });
    pipeline.addStage({
      stageName: 'Source',
      actions: [sourceAction]
    });

    // Add action to build.
    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'Build',
      project: new codebuild.PipelineProject(this, `BuildProject`, {
        environment: {
          buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3
        }
      }),
      runOrder: 2,
      input: sourceOutput,
      outputs: [buildOutput]
    });
    pipeline.addStage({
      stageName: 'Build',
      actions: [buildAction]
    });

    // Add action to deploy to S3 bucket.
    const deployAction = new codepipeline_actions.S3DeployAction({
      actionName: 'Deploy',
      input: buildOutput,
      bucket: s3Bucket,
      runOrder: 3
    });
    pipeline.addStage({
      stageName: 'Deploy',
      actions: [deployAction]
    });

    // Output CodeCommit repository information.
    new cdk.CfnOutput(this, 'CodeCommitCloneUrlHttp', {
      value: codeCommitRepo.repositoryCloneUrlHttp
    });
    new cdk.CfnOutput(this, 'CodeCommitCloneUrlSsh', {
      value: codeCommitRepo.repositoryCloneUrlSsh
    });
    new cdk.CfnOutput(this, 'StaticSiteUrl', {
      value: s3Bucket.bucketWebsiteUrl
    });
  }
}
