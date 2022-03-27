# Welcome to your CDK TypeScript project

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

## Initialise repo

## CDN validation:

```
aws cloudformation describe-stack-resources --stack-name PhotographyStack --query "StackResources[?starts_with(LogicalResourceId,'photographydistribution') && ResourceType=='AWS::CloudFront::Distribution'].PhysicalResourceId" --output text
```

```
aws cloudfront create-invalidation --distribution-id ****** --paths "/*"
```
Output:
```
Invalidation:
  CreateTime: '2022-03-03T00:09:21.341000+00:00'
  Id: I11CWH6K3GJLSZ
  InvalidationBatch:
    CallerReference: cli-1646266159-416024
    Paths:
      Items:
      - /*
      Quantity: 1
  Status: InProgress
Location: https://cloudfront.amazonaws.com/2020-05-31/distribution/******/invalidation/I11CWH6K3GJLSZ
(END)
```

## upload files to s3

```
aws s3 cp src/web/js/app.js s3://BUCKET/js/app.js

aws s3 cp src/web/index.html s3://BUCKET

aws s3 cp src/web/styles/main.css s3://BUCKET/styles/main.css
```


GET request from API endpoint:

[{"key":"photos/f9l7rl6oshobpsx8-bat.jpg","id":"4ykgv1a80fjx6gjv"},{"key":"js/app.js","id":"8zclekd4ood04qbh"},{"key":"styles/main.css","id":"buce5idtmnuct853"},{"key":"photos/4p2iu944a7bindzn-bat.jpg","id":"y9xgu2wnd97ch9b4"}]

Send a DELETE request to API endpoint:

params kEY: Bucket VALUE: photographystack-photographyphotobucketd4e5a7a0-70f6wifq5iv2
{"key":"photos/f9l7rl6oshobpsx8-bat.jpg","id":"4ykgv1a80fjx6gjv"}



https://d1j8qxfcnqrvdm.cloudfront.net/

API endpoint: https://lz0onnns18.execute-api.us-east-1.amazonaws.com/prod/photo

aws s3 cp src/web/js/app.js s3://photographystack-photographyappbucket7ca1a47d-1twzvbf6idhn5/js/app.js

aws s3 cp src/web/styles/main.css s3://photographystack-photographyappbucket7ca1a47d-1twzvbf6idhn5/styles/main.css

upload: src/web/index.html to s3://photographystack-photographyappbucket7ca1a47d-1twzvbf6idhn5/index.html
