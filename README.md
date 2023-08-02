# AWS S3 React Template
This repository contains an AWS CDK project that sets up infrastructure for hosting a static React application on Amazon S3, utilizing AWS CodeCommit for source control and AWS CodePipeline for automated deployments.

# Prerequisites
- AWS account
- AWS CLI installed and configured
- Node.js installed (version 14.x or higher)
- AWS CDK installed (version 2.x or higher)
- Git CLI installed and configured
- Ensure that HTTPS Git credentials for CodeCommit are issued for an arbitrary IAM user.
  - [Setup for HTTPS users using Git credentials | Step 3: Create Git credentials for HTTPS connections to CodeCommit](https://docs.aws.amazon.com/codecommit/latest/userguide/setting-up-gc.html#setting-up-gc-iam)

# Project structure

```
.
├── bin
│   └── aws-s3-react-template.ts        # CDK application entry point
├── lib
│   └── aws-s3-react-template-stack.ts  # Stack definition (contains the code you provided)
├── package.json         # Project dependencies
└── README.md            # This file
```

# Usage
## 1.Clone this repository.
```shell
git clone https://github.com/ShutoYamada/aws-s3-react-template.git
```
## 2.Install the dependencies.
```shell
yarn
```
## 3.Set Enviroment Parameters.
Upon running the yarn command, a `.env` file will be automatically generated. Please refer to the `.env.sample` file and fill in the appropriate values.
## 4.Deploy the CDK stack.
※For the first time only, please execute the 'yarn bootstrap' command.

Execute the following command.
```shell
yarn deploy
```
The stack deployment will create the Amazon S3 bucket, AWS CodeCommit repository, and AWS CodePipeline. The output will include the repository clone URLs.
## 5.Clone the created CodeCommit repository and add your React application source code.
```shell
git clone <repository-clone-url-http>
```

Enter the pre-issued HTTPS Git credentials for CodeCommit.

## 5.1 Create React Application

```shell
cd <cloned-repository>
npm create vite@latest . --template react
```

Please create a React project following the command line instructions of Vite.

Next. Create a `buildspec.yml` file for your React project with the following format:

```yml:buildspec.yml.example
version: 0.2

phases:
  install:
    install:
    commands:
      - n 16.15.0
      - echo node -v
      - node -v
      - echo npm -v
      - npm -v
      - npm i yarn
      - echo yarn -v
      - yarn -v
  pre_build:
    commands:
      - echo Installing source from dependencies...
      - yarn
  build:
    commands:
      - echo Start build...
      - yarn run build

artifacts:
  base-directory: dist
  files:
    - "**/*"

cache:
  paths:
    - node_modules/**/*
```

Commit and push the changes to the master branch. The CodePipeline will automatically detect changes and deploy the updated React application to the Amazon S3 bucket.
## 6.Cleanup
To delete the created resources, run:
```
yarn destroy
```

Note that this will remove the S3 bucket, CodeCommit repository, and CodePipeline.

# Additional Resources
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/v2/guide/home.html)
- [Amazon S3 Documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)
- [AWS CodeCommit Documentation](https://docs.aws.amazon.com/codecommit/latest/userguide/welcome.html)
- [AWS CodePipeline Documentation](https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html)

# Contributing
Feel free to submit issues or pull requests for improvements or bug fixes.

# License
This project is licensed under the MIT License.