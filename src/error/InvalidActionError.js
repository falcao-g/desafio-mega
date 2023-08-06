const DEFAULT_ERROR_MESSAGE = 'That action is invalid';
const BAD_REQUEST = 400;

function InvalidActionError(status = '', message = DEFAULT_ERROR_MESSAGE, httpStatus = BAD_REQUEST) {
  this.name = 'InvalidActionError';
  this.message = message;
  this.httpStatus = httpStatus;
  this.status = status;
}

module.exports = { InvalidActionError };
