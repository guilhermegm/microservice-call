# Microservice Call

Microservice Registry integration lib

## Installation

```
npm install microservice-call --save
```

## Usage

```
const microserviceCall = require('microservice-call')
```

Register a service

```
microserviceCall.register({
  name: 'Service Name',
  version: '1.0.0',
  url: 'http://localhost:3100',
})
```

Discovery a service

```
microserviceCall.discovery({
  name: 'Service Name',
  env: 'development',  
})
.then(console.log)
```

Call a service

```
microserviceCall.call({
  name: 'Service Name',
  uri: '/v1/posts',
  requestOptions: {
    method: 'GET',
    headers: {},
    json: true,
    qs: {},
    body: {},
  },
})
.then(console.log)
```
