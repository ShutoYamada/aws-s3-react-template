# AWS S3 React Template
This repository contains an AWS CDK project that sets up infrastructure for hosting a static React application on Amazon S3, utilizing AWS CodeCommit for source control and AWS CodePipeline for automated deployments.

# Prerequisites
- AWS account
- AWS CLI installed and configured
- Node.js installed (version 14.x or higher)
- AWS CDK installed (version 2.x or higher)

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
```
git clone <repository-url>
```
## 2.Install the dependencies.
```
yarn
```
## 3.Set Enviroment Parameters.
Please copy the local `.env.sample` file to a new file named `.env` and fill in the necessary values.
## 4.Deploy the CDK stack.
```
yarn deploy
```
The stack deployment will create the Amazon S3 bucket, AWS CodeCommit repository, and AWS CodePipeline. The output will include the repository clone URLs, username, and password.
## 5.Clone the created CodeCommit repository and add your React application source code.
```
git clone <repository-clone-url-http>
```

Please create a `buildspec.yml` file for your React project with the following format:
```yml
version: 0.2

phases:
  install:
    commands:
      - n 16.15.0
      - npm i yarn
      - yarn
  build:
    commands:
      - yarn run build

artifacts:
  base-directory: build
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