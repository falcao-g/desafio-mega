const DEFAULT_ERROR_MESSAGE = 'You are unauthorized to perform this action.';
const UNAUTHORIZED = 401;

function AuthenticationError(message = DEFAULT_ERROR_MESSAGE, httpStatus = UNAUTHORIZED) {
  this.name = 'AuthenticationError';
  this.message = message;
  this.httpStatus = httpStatus;
}

module.exports = { AuthenticationError };
