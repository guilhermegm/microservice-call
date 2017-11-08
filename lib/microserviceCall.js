const request = require('request-promise');

const NODE_ENV = process.NODE_ENV || 'stage';
const microserviceRegistryUrl = process.MICROSERVICE_REGISTRY_URL || 'http://localhost:3500';
const microservicesData = {};

const formatMicroserviceKey = ({ name, env }) => `${name}_${env}`;

const register = ({ name, version, url, env = NODE_ENV }) => {
  const options = {
    url: `${microserviceRegistryUrl}/v1/microservices`,
    method: 'POST',
    body: {
      url,
      env,
      name,
      version
    },
    json: true
  };

  return request(options);
};

const discovery = ({ name, env }) => {
  const microserviceKey = formatMicroserviceKey({ name, env });
  const options = {
    url: `${microserviceRegistryUrl}/v1/microservices/${microserviceKey}`,
    method: 'GET'
  };

  return request(options)
  .then((microserviceResponse) => {
    microservicesData[microserviceKey] = JSON.parse(microserviceResponse).data;
    return microservicesData[microserviceKey];
  });
};

const call = ({ name, uri, requestOptions, env = NODE_ENV }) => {
  let promiseChain;
  const microserviceKey = formatMicroserviceKey({ name, env });

  if (!microservicesData[microserviceKey]) {
    promiseChain = discovery({ name, env });
  } else {
    promiseChain = Promise.resolve(microservicesData[microserviceKey]);
  }

  return promiseChain
  .then((microserviceData) => {
    const newRequestOptions = Object.assign(
      {},
      requestOptions,
      { url: `${microserviceData.url}${uri}` }
    );
    return request(newRequestOptions);
  });
};

module.exports = {
  discovery,
  call,
  register
};
