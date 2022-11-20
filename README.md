## Description

Nestjs Microservice Custom Transport using GCP PubSub

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# start main service
$ yarn start

# start another service
$ nest start another-service
```

## Environment Variables
```bash
PROJECT_ID=''
TOPIC=''
TOPIC_SUB=''
RESPONSE_TOPIC='' // Topic for publishing response. this is set when doing request/request method
```

## Creating Microservice
```javascript
const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  strategy: new GCPPubSubServer({
    projectId: process.env.PROJECT_ID,
    subscription: process.env.TOPIC_SUB,
    topic: process.env.TOPIC
  })
});
  
await app.listen();
```

## Registering Client
```javascript
GCPModule.register(
  [
    {
      name: 'MY_CLIENT',
      projectId: process.env.PROJECT_ID,
      topic: process.env.TOPIC,
      responseTopic: process.env.RESPONSE_TOPIC
    }
  ]
)
```

## Methods
```javascript
this.client.emit('EVENT_NAME', { message: 'via emit' });

this.client.send('EVENT_NAME', { message: 'via send' })
    .subscribe(res => console.log('response: ', res));
```
