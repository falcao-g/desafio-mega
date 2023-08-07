const DEFAULT_ERROR_MESSAGE = 'This item is not yours';
const HTTP_FORBIDDEN = 403;

function InvalidItemError(message = DEFAULT_ERROR_MESSAGE, httpStatus = HTTP_FORBIDDEN) {
  this.name = 'InvalidItemError';
  this.message = message;
  this.httpStatus = httpStatus;
}

module.exports = { InvalidItemError };
