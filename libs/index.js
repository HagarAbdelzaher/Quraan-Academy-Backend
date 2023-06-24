const BaseError = require('./baseError');
const Requester = require('./requester');

const asycnWrapper = (promise) => promise
  .then((data) => [undefined, data])
  .catch((error) => [error]);

module.exports = {
  BaseError,
  asycnWrapper,
  Requester,
};
