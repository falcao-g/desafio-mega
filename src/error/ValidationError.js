const DEFAULT_ERROR_MESSAGE = 'An validation error occured';
const BAD_REQUEST = 400;

function ValidationError(message = DEFAULT_ERROR_MESSAGE) {
  this.name = 'ValidationError';
  this.message = message;
  this.httpStatus = BAD_REQUEST;
}

module.exports = { ValidationError };
