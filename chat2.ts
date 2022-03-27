“Thank you for taking time out to join us at our AWS Learning and Recruiting Event. The session will commence shortly. Thank you for your patience.”

Event Engine https://dashboard.eventengine.run/login 
70bc-100b3d3c74-b1

Audience Question
Q: Afternoon Everyone!
A: hello Everyone !!

For anyone who may not have it, you can download yesterday's code from the below link:

https://d2ohiwocyfd7ru.cloudfront.net/photography1.zip

Audience Question
Q: Great session yesterday, looking forward to todays. Thanks again team!
A: Thank you! Hope you are going to enjoy today's session as well!

Event Engine https://dashboard.eventengine.run/login 
70bc-100b3d3c74-b1

https://d2ohiwocyfd7ru.cloudfront.net/photography1.zip

https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront.Distribution.html

Audience Question
Q: Question, yesterday I missed the link as I was just watching from the phone
A: Hey Roger, which link do you mean?

defaultRootObject: "index.html"

Audience Question
Q: I meant the link to access the account for this lab
A: Can you use this event link and the hash key to access your account please? Event Engine https://dashboard.eventengine.run/login 70bc-100b3d3c74-b1

Audience Question
Q: Thanks
A: Can you try download this zipped file from this url please?: https://d2ohiwocyfd7ru.cloudfront.net/photography1.zip

Q: I am able to loginto aws console, but cloud9 has been loading for a while and still connecting

Audience Question
Q: yes, I will be just a little behind as I am connecting now
A: Cool! Let me know if you need anything.

Q: I am able to loginto aws console, but cloud9 has been loading for a while and still connecting
A: It can take a minute or two for Cloud9 to start up. If you find your browser stops responding try and reload the page.

=======Part 1- upload =======

src/create/index.js

const AWS = require('aws-sdk'); 
const s3 = new AWS.S3(); 

exports.handler = async (event) => { 

console.log(JSON.stringify(event)); 

let result = {}; 

const {fileAsBase64, name, type} = JSON.parse(event.body); 

const randomId = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10); 
const body = Buffer.from(fileAsBase64.replace(/^data:image\/\w+;base64,/, ''),'base64'); 
const params = { 
Bucket: process.env.BUCKET, 
Key: `photos/${randomId}-${name}`, // we write to subdirectory /photos because we wanted to use the same CloudFront origin path /photos 
Body:body, 
ContentEncoding: 'base64', 
ContentType: type 
}; 
await s3.putObject(params).promise(); 

result = {'success': true}; 

return { 
statusCode: 200, 
headers: { 
'Content-Type': 'application/json' , 
'Access-Control-Allow-Headers' : '*', 
'Access-Control-Allow-Origin': '*', 
'Access-Control-Allow-Methods': 'OPTIONS,POST,GET' 
}, 
body: JSON.stringify(result) 
} 
}

Audience Question
Q: what's the difference?
A: fromInline means you will write some lambda code within you cdk script, fromAsset means the function code is from somewhere else, such as a local path.

Audience Question
Q: lost some of you guys explanation
A: Please type you questions here, will will try to answer your question here

Audience Question
Q: what does this handler do ?
A: Entry point of your code ...

https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda.Function.html

Audience Question
Q: ok, and where is the example for using the "environment:"?
A: See the doc please of CDK lambda

https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.RestApi.html

Audience Question
Q: Can you also Show how it is done via console, so it will become easy to understand because typsecript is little tough to understand?
A: we might not be able to do so becuse the time is quite limited, but you can absolutely explore this a little on your own offline with this event AWS account.

Audience Question
Q: pls paste cors code. Thanks
A: It will be pasted soon :)

Audience Question
Q: Can you please paste the code at the end?
A: SURE

import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib'; 
import { Construct } from 'constructs'; 
import * as s3 from 'aws-cdk-lib/aws-s3'; 
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'; 
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'; 
import * as lambda from 'aws-cdk-lib/aws-lambda'; 
import * as apigateway from 'aws-cdk-lib/aws-apigateway'; 

export class PhotographyStack extends Stack { 
constructor(scope: Construct, id: string, props?: StackProps) { 
super(scope, id, props); 

// The code that defines your stack goes here 

// example resource 
const appBucket = new s3.Bucket(this, "photography-app-bucket", { 
blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL 
}); 

// S3 bucket for photos 
const photoBucket = new s3.Bucket(this, "photography-photo-bucket", { 
blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL 
}); 

const appDistribution = new cloudfront.Distribution(this, 'photography-distribution', { 
defaultBehavior: { origin: new origins.S3Origin(appBucket) }, 
defaultRootObject: "index.html" 
}); 


const createFunction = new lambda.Function(this, "photography-upload-function", { 
runtime: lambda.Runtime.NODEJS_14_X, 
code: lambda.Code.fromAsset("src/create"), 
handler: "index.handler", 
environment: { 
"BUCKET": photoBucket.bucketName 
} 
}) 

photoBucket.grantWrite(createFunction) 

const photoApi = new apigateway.RestApi(this, "photography-photo-api", { 
defaultCorsPreflightOptions: { 
allowOrigins: apigateway.Cors.ALL_ORIGINS, 
allowMethods: apigateway.Cors.ALL_METHODS 
} 
}) 

const uploadResource = photoApi.root.addResource("photo"); 
uploadResource.addMethod("POST", new apigateway.LambdaIntegration(createFunction)) 

new CfnOutput(this, "AppBucket", {value: appBucket.bucketName}) 
new CfnOutput(this, "CfDistDomainName", {value: appDistribution.domainName}) 

new CfnOutput(this, "PhotoBucket", {value: photoBucket.bucketName}) 
new CfnOutput(this, "APIEndpoint", {value: photoApi.url}) 
new CfnOutput(this, "UploadResource", {value: uploadResource.path}) 

} 
}

====== src/web/js/app.js ====

// update with your api endpoint const API_ENDPOINT = 'https://y14fkped47.execute-api.ap-southeast-2.amazonaws.com/prod'; const DEBUG = false; const toBase64 = file => new Promise((resolve, reject) => { const reader = new FileReader(); reader.readAsDataURL(file); reader.onload = () => resolve(reader.result); reader.onerror = error => reject(error); }); const uploadPhoto = async () => { const formData = new FormData(); const file = document.querySelector('#file-upload').files[0]; DEBUG && console.log(file); const fileAsBase64 = await toBase64(file); formData.append('file', file.value); fetch(`${API_ENDPOINT}/photo`, { method: 'POST', body: JSON.stringify({ fileAsBase64: fileAsBase64, name: file.name, type: file.type, }) }) .then(response => response.json()) .then(data => { http://console.infoconsole.info('successfully uploading file'); 
DEBUG && console.log(data); 
}) 
.catch(error => { 
console.error('error uploading file'); 
DEBUG && console.error(error); 
}) 
} 

const uploadPhotoUi = () => { 
const fileUploadInput = document.createElement('input'); 
fileUploadInput.setAttribute('id', 'file-upload'); 
fileUploadInput.setAttribute('type', 'file'); 
fileUploadInput.setAttribute('accept', '.png,.jpg,.jpeg'); 

const uploadButton = document.createElement('button'); 
uploadButton.setAttribute('id', 'upload'); 
uploadButton.setAttribute('type', 'button'); 
uploadButton.innerHTML = 'Upload'; 
uploadButton.addEventListener('click', uploadPhoto); 

const uploadForm = document.createElement('form'); 
uploadForm.setAttribute('id', 'upload-form'); 
uploadForm.appendChild(fileUploadInput); 
uploadForm.appendChild(uploadButton); 
document.querySelector('div#app').appendChild(uploadForm); 
} 

(function() { 
console.log('loading app ...'); 

uploadPhotoUi(); 

console.log('app loading complete'); 
})();

==== index.html ====

<!-- expected filename src/web/index.html--> 

<!doctype html> 
<html class="no-js" lang=""> 

<head> 
<meta charset="utf-8"> 
<title></title> 
</head> 

<body> 
<p>My Photography Website</p> 
<div id="app"></div> 

<script src="/js/app.js"></script> 
</body> 

</html>

Audience Question
Q: I ran that
A: Can you confirm if the bootstarp stack in CloudFormation console still exist?

aws s3 cp src/web/index.html s3://

aws s3 cp src/web/js/app.js s3://<BUCKET>/js/app.js

Audience Question
Q: can you please give us 2 min to complete the procedure till now.
A: We will have a break shortly :)

aws cloudformation describe-stack-resources --stack-name PhotographyStack --query "StackResources[?starts_with(LogicalResourceId,'photographydistribution') && ResourceType=='AWS::CloudFront::Distribution'].PhysicalResourceId" --output text

aws cloudfront create-invalidation --distribution-id E281YYW00RMADY --paths "/*"

Audience Question
Q: Getting a create failed on Lambda function for the stack.
A: It seems the folder that conatins the lambda function code is empty

Audience Question
Q: the lambda file is src/create/index.js ?
A: We are sharing the code, you can check the path that you configured for your lambda function in the CDK script on lambda function resource.

Audience Question
Q: As I will replicate the lab from yesterday and finish the one for today. Is there a chance to have an email from one of the technical guys here so I can report what I did and maybe ask questions later?.
A: Hi Roger. We will share an email by the end of session that you can send your assesment and ask questions.

Audience Question
Q: when a user can upload directly to S3 bucket why lambda is required ? sorry bit confused
A: The lambda function is the computing engine, if you have to do something to the image, the lambda would do that. Like changing the size of the image or making a thumbnail of the image. The apigateway is just the service engine.

Audience Question
Q: http://d3hyr7vkyo4dra.cloudfront.net/
A: Got 5XX check Lambda errors.

Audience Question
Q: How do you suggest managing the compliance when the customer have issues regarding increasing the level of abstraction and still providing the customer some control?
A: What does the customer need to control?

Audience Question
Q: Do we need to use photobucket to upload the app.js file?
A: Hi Anurag, the Lambda function at backend will figure out which bucket to use.

Audience Question
Q: How can we open the url that we created to upolad the images site
A: You can directly use that CloudFront distrubution URL to access it.

https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_dynamodb.Table.html

Audience Question
Q: fixed that - still Cors issue now (Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://tp9fxy87xb.execute-api.us-east-1.amazonaws.com/prod/photo. (Reason: CORS header ‘Access-Control-Allow-Origin’ missing). Status code: 502.)
A: DO You see a OPTIONS method in your API ?

Audience Question
Q: maybe some of the servers on his domain if it was a bank for example and they have particular things they dont want to hand over to AWS like the full cotrol. For instance, not always customers disclosure exact reasons why they are concerned about using a full scale of serveless solution. WE just assume that it could have some sort of domain policies that would make them geta a bit funny about it.
A: There are other Cloud Solutions besides Serverless we can offer those based on custoner's need

Audience Question
Q: Don't know if it make sense. Basically offer a serveless solution.. some level of abstraction without completely take away the customer control of his environment
A: That's sort of against the idea of "Serverless". With lambda function here, you have all the benefit from it that you only need to worry about the functions that need to be run and you less care the actual server itself, which is managed by AWS. Otherwise you might want to use some other servise such as ECS EKS to build your micro service instead of going Serverless.

==== part 2 - register ====

src/register/index.js

const AWS = require('aws-sdk'); const docClient = new AWS.DynamoDB.DocumentClient(); exports.handler = async (event) => { console.log(JSON.stringify(event)); // loop through each record for (let i=0; i < event.Records.length; i++) { const { s3 } = event.Records[i]; // write to DynamoDB with random ID const randomId = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10); // Using documentClient to update DynamoDB item // @see https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-document-client.html#dynamodb-example-document-client-update 
await docClient.put({ 
TableName: process.env.TABLE_NAME, 
Item: { 
'id': randomId, 
'key': s3.object.key 
} 
}).promise(); 
} 

return {}; 
}

Audience Question
Q: register and create folder has same index.js - this will get confused?
A: NO , different Lambda will use those

Audience Question
Q: Do you have that configured? Yes, this is my stack code const photoApi = new apigateway.RestApi(this, "photography-photo-api", {
 defaultCorsPreflightOptions: {
 allowOrigins: apigateway.Cors.ALL_ORIGINS,
 allowMethods: apigateway.Cors.ALL_METHODS
 }
 })
A: Looks good, can you disable your browsers CORS check? What browser you are using ?

Audience Question
Q: Looks good, can you disable your browsers CORS check? What browser you are using ? Firefox, I will try a different browser.
A: https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/ to disable CORS check

Audience Question
Q: Code please :)
A: We will share the full code by the end of this session

==== register =====

import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib'; 
import { Construct } from 'constructs'; 
import * as s3 from 'aws-cdk-lib/aws-s3'; 
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'; 
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'; 
import * as lambda from 'aws-cdk-lib/aws-lambda'; 
import * as apigateway from 'aws-cdk-lib/aws-apigateway'; 
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'; 
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources'; 


export class PhotographyStack extends Stack { 
constructor(scope: Construct, id: string, props?: StackProps) { 
super(scope, id, props); 

// The code that defines your stack goes here 

// example resource 
const appBucket = new s3.Bucket(this, "photography-app-bucket", { 
blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL 
}); 

// S3 bucket for photos 
const photoBucket = new s3.Bucket(this, "photography-photo-bucket", { 
blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL 
}); 

const appDistribution = new cloudfront.Distribution(this, 'photography-distribution', { 
defaultBehavior: { origin: new origins.S3Origin(appBucket) }, 
defaultRootObject: "index.html" 
}); 


const createFunction = new lambda.Function(this, "photography-upload-function", { 
runtime: lambda.Runtime.NODEJS_14_X, 
code: lambda.Code.fromAsset("src/create"), 
handler: "index.handler", 
environment: { 
"BUCKET": photoBucket.bucketName 
} 
}) 

photoBucket.grantWrite(createFunction) 

const photoApi = new apigateway.RestApi(this, "photography-photo-api", { 
defaultCorsPreflightOptions: { 
allowOrigins: apigateway.Cors.ALL_ORIGINS, 
allowMethods: apigateway.Cors.ALL_METHODS 
} 
}) 

const uploadResource = photoApi.root.addResource("photo"); 
uploadResource.addMethod("POST", new apigateway.LambdaIntegration(createFunction)) 

// DDB table store image data 
const photoTable = new dynamodb.Table(this, "photography-table", { 
partitionKey: { 
name: "id", type: dynamodb.AttributeType.STRING 
} 
}) 

const registerFunction = new lambda.Function(this, "photography-function-register", { 
runtime: lambda.Runtime.NODEJS_14_X, 
code: lambda.Code.fromAsset('src/register'), 
handler: 'index.handler', 
environment: { 
"TABLE_NAME": photoTable.tableName 
} 
}) 

registerFunction.addEventSource(new S3EventSource(photoBucket, { 
events: [ 
s3.EventType.OBJECT_CREATED 
] 
})) 

photoBucket.grantRead(registerFunction) 
photoTable.grantWriteData(registerFunction) 

new CfnOutput(this, "AppBucket", {value: appBucket.bucketName}) 
new CfnOutput(this, "CfDistDomainName", {value: appDistribution.domainName}) 
new CfnOutput(this, "CfDistDomainId", {value: appDistribution.distributionId}) 

new CfnOutput(this, "PhotoBucket", {value: photoBucket.bucketName}) 
new CfnOutput(this, "APIEndpoint", {value: photoApi.url}) 
new CfnOutput(this, "UploadResource", {value: uploadResource.path}) 

} 
}

Audience Question
Q: which code goes inside the register folder?
A: The lastest code that we have pasted in the Chat box will be the one.

Audience Question
Q: so above code is for the file named photography-stack.ts right?
A: Yes

Audience Question
Q: Mine got uploaded!
A: Awesome!

Audience Question
Q: Pasing error, Unexpected token
A: Remove ===this code goes into the /src/register folder, named as index.js===

Audience Question
Q: const AWS = require('aws-sdk');
 ===this code goes into the /src/register folder, named as index.js===
 
 const docClient = new AWS.DynamoDB.DocumentClient();
 
 exports.handler = async (event) => {
 console.log(JSON.stringify(event));
 
 // loop through each record
 for (let i=0; i < event.Records.length; i++) {
 const { s3 } = event.Records[i];
 // write to DynamoDB with random ID
 const randomId = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
 // Using documentClient to update DynamoDB item
 // @see https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-document-client.html#dynamodb-example-document-client-update
 await docClient.put({
 TableName: process.env.TABLE_NAME,
 Item: {
 'id': randomId,
 'key': s3.object.key 
 }
 }).promise();
 }
 
 return {};
 }
A: ===this code goes into the /src/register folder, named as index.js=== remove this

Audience Question
Q: Found the error - can upload images now. Was missing a library import in the create lamdba function (didn't copy and paste properly)
A: Good to know!

Audience Question
Q: pls ignore, its for the .ts file not .js. Thanks
A: NP

Audience Question
Q: there's an unexpected token error in register/index.js for me. Is that ok?
A: Remove thsi ===this code goes into the /src/register folder, named as index.js===

Audience Question
Q: or could be because of VPC Cold Start Latency
A: ??? no VPC is involved this, this is serverless stuff

Audience Question
Q: I meant the serverless code start latency
A: JavaScript Lambda has negligible cold start time

====== part 3 list images =====

==== src/list/index.js =====

const AWS = require('aws-sdk'); const docClient = new AWS.DynamoDB.DocumentClient(); exports.handler = async (event) => { // Using documentClient to update DynamoDB item // @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property 
const result = await docClient.scan({ 
TableName: process.env.TABLE_NAME 
}).promise(); 

return { 
statusCode: 200, 
headers: { 
"Content-Type": "application/json", 
"Access-Control-Allow-Headers" : "*", 
"Access-Control-Allow-Origin": "*", 
"Access-Control-Allow-Methods": "OPTIONS,POST,GET" 
}, 
body: JSON.stringify(result.Items) 
} 
}

==== photography-stack.ts =====

import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib'; 
import { Construct } from 'constructs'; 
import * as s3 from 'aws-cdk-lib/aws-s3'; 
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'; 
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'; 
import * as lambda from 'aws-cdk-lib/aws-lambda'; 
import * as apigateway from 'aws-cdk-lib/aws-apigateway'; 
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'; 
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources'; 


export class PhotographyStack extends Stack { 
constructor(scope: Construct, id: string, props?: StackProps) { 
super(scope, id, props); 

// The code that defines your stack goes here 

// example resource 
const appBucket = new s3.Bucket(this, "photography-app-bucket", { 
blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL 
}); 

// S3 bucket for photos 
const photoBucket = new s3.Bucket(this, "photography-photo-bucket", { 
blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL 
}); 

const appDistribution = new cloudfront.Distribution(this, 'photography-distribution', { 
defaultBehavior: { origin: new origins.S3Origin(appBucket) }, 
defaultRootObject: "index.html", 
additionalBehaviors: { 
'/photos/*': { 
origin: new origins.S3Origin(photoBucket) 
} 
} 
}); 


const createFunction = new lambda.Function(this, "photography-upload-function", { 
runtime: lambda.Runtime.NODEJS_14_X, 
code: lambda.Code.fromAsset("src/create"), 
handler: "index.handler", 
environment: { 
"BUCKET": photoBucket.bucketName 
} 
}) 

photoBucket.grantWrite(createFunction) 

const photoApi = new apigateway.RestApi(this, "photography-photo-api", { 
defaultCorsPreflightOptions: { 
allowOrigins: apigateway.Cors.ALL_ORIGINS, 
allowMethods: apigateway.Cors.ALL_METHODS 
} 
}) 

const uploadResource = photoApi.root.addResource("photo"); 
uploadResource.addMethod("POST", new apigateway.LambdaIntegration(createFunction)) 

// DDB table store image data 
const photoTable = new dynamodb.Table(this, "photography-table", { 
partitionKey: { 
name: "id", type: dynamodb.AttributeType.STRING 
} 
}) 

const registerFunction = new lambda.Function(this, "photography-function-register", { 
runtime: lambda.Runtime.NODEJS_14_X, 
code: lambda.Code.fromAsset('src/register'), 
handler: 'index.handler', 
environment: { 
"TABLE_NAME": photoTable.tableName 
} 
}) 

registerFunction.addEventSource(new S3EventSource(photoBucket, { 
events: [ 
s3.EventType.OBJECT_CREATED 
] 
})) 

photoBucket.grantRead(registerFunction) 
photoTable.grantWriteData(registerFunction) 

// List Images Lambda 
const listFunction = new lambda.Function(this, "photography-function-list", { 
runtime: lambda.Runtime.NODEJS_14_X, 
code: lambda.Code.fromAsset('src/list'), 
handler: 'index.handler', 
environment: { 
"TABLE_NAME": photoTable.tableName 
} 
}) 

photoTable.grantReadData(listFunction) 

uploadResource.addMethod("GET", new apigateway.LambdaIntegration(listFunction)) 

new CfnOutput(this, "AppBucket", {value: appBucket.bucketName}) 
new CfnOutput(this, "CfDistDomainName", {value: appDistribution.domainName}) 
new CfnOutput(this, "CfDistDomainId", {value: appDistribution.distributionId}) 

new CfnOutput(this, "PhotoBucket", {value: photoBucket.bucketName}) 
new CfnOutput(this, "APIEndpoint", {value: photoApi.url}) 
new CfnOutput(this, "UploadResource", {value: uploadResource.path}) 

} 
}

Audience Question
Q: Can we have app.js code
A: Sure

==== src/web/js/app.js =====

const API_ENDPOINT = 'API_ENDPOINT'; const DEBUG = false; const listPhotos = async () => { const response = await fetch(`${API_ENDPOINT}/photo`, { method: "GET" }); return await response.json(); } const renderPhotos = async () => { const photoList = document.createElement('div'); photoList.setAttribute('id', 'photo-list') const photos = await listPhotos(); photos.map(i => { const photoImage = document.createElement('img'); photoImage.setAttribute('src', i.key); photoImage.setAttribute('alt', i.key); photoImage.setAttribute('id', `photo-${i.id}`); const photoWrap = document.createElement('figure'); photoWrap.appendChild(photoImage) photoList.appendChild(photoWrap); }) document.querySelector('div#app').appendChild(photoList); } const toBase64 = file => new Promise((resolve, reject) => { const reader = new FileReader(); reader.readAsDataURL(file); reader.onload = () => resolve(reader.result); reader.onerror = error => reject(error); }); const uploadPhoto = async () => { const formData = new FormData(); const file = document.querySelector('#file-upload').files[0]; DEBUG && console.log(file); const fileAsBase64 = await toBase64(file); formData.append('file', file.value); fetch(`${API_ENDPOINT}/photo`, { method: 'POST', body: JSON.stringify({ fileAsBase64: fileAsBase64, name: file.name, type: file.type, }) }) .then(response => response.json()) .then(data => { http://console.infoconsole.info('successfully uploading file'); 
DEBUG && console.log(data); 
alert('success'); 
}) 
.catch(error => { 
console.error('error uploading file'); 
DEBUG && console.error(error); 
}) 
} 

const uploadPhotoUi = () => { 
const fileUploadInput = document.createElement('input'); 
fileUploadInput.setAttribute('id', 'file-upload'); 
fileUploadInput.setAttribute('type', 'file'); 
fileUploadInput.setAttribute('accept', '.png,.jpg,.jpeg'); 

const uploadButton = document.createElement('button'); 
uploadButton.setAttribute('id', 'upload'); 
uploadButton.setAttribute('type', 'button'); 
uploadButton.innerHTML = 'Upload'; 
uploadButton.addEventListener('click', uploadPhoto); 

const uploadForm = document.createElement('form'); 
uploadForm.setAttribute('id', 'upload-form'); 
uploadForm.appendChild(fileUploadInput); 
uploadForm.appendChild(uploadButton); 
document.querySelector('div#app').appendChild(uploadForm); 
} 

(function() { 
console.log('loading app ...'); 

uploadPhotoUi(); 
renderPhotos(); 

console.log('app loading complete'); 
})();

const API_ENDPOINT = 'API_ENDPOINT'

===== src/web/styles/main.css =====

html, body { 
min-height: 100%; 
background: #f5f4f4; 
font-family: Helvetica; 
} 

main { 
padding: 2rem; 
} 

#photo-list { 
margin: 2rem; 
display: grid; 
grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
grid-gap: 2rem; 
align-items: center; 
} 

#photo-list img { 
border: 1px solid #ccc; 
box-shadow: 2px 2px 6px 0px rgba(0,0,0,0.3); 
max-width: 100%; 
}

==== src/web/index.html ====

<!-- expected filename src/web/index.html--> 

<!doctype html> 
<html class="no-js" lang=""> 

<head> 
<meta charset="utf-8"> 
<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" /> 
<link rel="stylesheet" type="text/css" href="/styles/main.css" /> 
<title></title> 
</head> 

<body> 
<p>My Photography Website</p> 
<div id="app"></div> 

<script src="/js/app.js"></script> 
</body> 

</html>

==== upload static files ===

aws s3 cp src/web/js/app.js s3://BUCKET/js/app.js

aws s3 cp src/web/index.html s3://BUCKET

aws s3 cp src/web/styles/main.css s3://BUCKET/styles/main.css

aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"

Audience Question
Q: It does work!
A: :)


==== monitoring stack code =====

import { Stack, StackProps, CfnOutput, Duration } from 'aws-cdk-lib'; 
import { Construct } from 'constructs'; 
import * as s3 from 'aws-cdk-lib/aws-s3'; 
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'; 
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'; 
import * as lambda from 'aws-cdk-lib/aws-lambda'; 
import * as apigateway from 'aws-cdk-lib/aws-apigateway'; 
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'; 
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources'; 
import * as sns from 'aws-cdk-lib/aws-sns'; 
import * as events from 'aws-cdk-lib/aws-events'; 
import * as targets from "aws-cdk-lib/aws-events-targets"; 


export class PhotographyStack extends Stack { 
constructor(scope: Construct, id: string, props?: StackProps) { 
super(scope, id, props); 

// The code that defines your stack goes here 

// example resource 
const appBucket = new s3.Bucket(this, "photography-app-bucket", { 
blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL 
}); 

// S3 bucket for photos 
const photoBucket = new s3.Bucket(this, "photography-photo-bucket", { 
blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL 
}); 

const appDistribution = new cloudfront.Distribution(this, 'photography-distribution', { 
defaultBehavior: { origin: new origins.S3Origin(appBucket) }, 
defaultRootObject: "index.html", 
additionalBehaviors: { 
'/photos/*': { 
origin: new origins.S3Origin(photoBucket) 
} 
} 
}); 


const createFunction = new lambda.Function(this, "photography-upload-function", { 
runtime: lambda.Runtime.NODEJS_14_X, 
code: lambda.Code.fromAsset("src/create"), 
handler: "index.handler", 
environment: { 
"BUCKET": photoBucket.bucketName 
} 
}) 

photoBucket.grantWrite(createFunction) 

const photoApi = new apigateway.RestApi(this, "photography-photo-api", { 
defaultCorsPreflightOptions: { 
allowOrigins: apigateway.Cors.ALL_ORIGINS, 
allowMethods: apigateway.Cors.ALL_METHODS 
} 
}) 

const uploadResource = photoApi.root.addResource("photo"); 
uploadResource.addMethod("POST", new apigateway.LambdaIntegration(createFunction)) 

// DDB table store image data 
const photoTable = new dynamodb.Table(this, "photography-table", { 
partitionKey: { 
name: "id", type: dynamodb.AttributeType.STRING 
} 
}) 

const registerFunction = new lambda.Function(this, "photography-function-register", { 
runtime: lambda.Runtime.NODEJS_14_X, 
code: lambda.Code.fromAsset('src/register'), 
handler: 'index.handler', 
environment: { 
"TABLE_NAME": photoTable.tableName 
} 
}) 

registerFunction.addEventSource(new S3EventSource(photoBucket, { 
events: [ 
s3.EventType.OBJECT_CREATED 
] 
})) 

photoBucket.grantRead(registerFunction) 
photoTable.grantWriteData(registerFunction) 

// List Images Lambda 
const listFunction = new lambda.Function(this, "photography-function-list", { 
runtime: lambda.Runtime.NODEJS_14_X, 
code: lambda.Code.fromAsset('src/list'), 
handler: 'index.handler', 
environment: { 
"TABLE_NAME": photoTable.tableName 
} 
}) 

photoTable.grantReadData(listFunction) 

uploadResource.addMethod("GET", new apigateway.LambdaIntegration(listFunction)) 

// SNS Topic 
const monitorTopic = new sns.Topic(this, "WebsiteIsDownTopic", { 
topicName: "WebsiteIsDown", 
displayName: "Website is Down" 
}) 

// Lambda function 
const monitorWebsiteFunction = new lambda.Function(this, "MonitorWebsite", { 
runtime: lambda.Runtime.NODEJS_14_X, 
code: lambda.Code.fromAsset("src/monitor"), 
handler: "index.handler", 
environment: { 
"SNS_TOPIC": monitorTopic.topicArn 
} 
}) 

// create Cloudwatch rule 
new events.Rule(this, 'MonitorWebsiteRule', { 
description: "CloudWatch event to trigger Lambda every one minute", 
schedule: events.Schedule.rate(Duration.minutes(1)), 
targets: [ 
// add CloudWatch target 
new targets.LambdaFunction(monitorWebsiteFunction, {
event: events.RuleTargetInput.fromObject({}) 
}) 
] 
}); 

new CfnOutput(this, "AppBucket", {value: appBucket.bucketName}) 
new CfnOutput(this, "CfDistDomainName", {value: appDistribution.domainName}) 
new CfnOutput(this, "CfDistDomainId", {value: appDistribution.distributionId}) 

new CfnOutput(this, "PhotoBucket", {value: photoBucket.bucketName}) 
new CfnOutput(this, "APIEndpoint", {value: photoApi.url}) 
new CfnOutput(this, "UploadResource", {value: uploadResource.path}) 

} 
}

-------

==== src/monitoring/index.js ====

const ENDPOINT = "<WEB-SITE-URL>" 

const AWS = require('aws-sdk'); 
const SNS = new AWS.SNS(); 

const checkWebsite = async (url) => { 
// TODO : this code would make a request to website URL and check status code 
// return true if status code is 200 OK - otherwise return false 


// for this example, we simply return random true or false 
return Math.round(Math.random()) ? true : false; 
} 


/** 
* @description: Lambda main handler 
*/ 
exports.handler = async (event) => { 

// check if website is up/down 
const isWebsiteUp = await checkWebsite( ENDPOINT ); 

// publish to SNS 
if (!isWebsiteUp) { 
console.log("sending alert") 
const params = { 
TopicArn: process.env.SNS_TOPIC, 
Message: "Alert: website is down" 
}; 
await SNS.publish(params).promise(); 
} 

return isWebsiteUp; 

}

-----