const USER_NOT_FOUND = "user not found";
const WRONG_PASSWORD = "wrong password";
const USER_ALREADY_REGISTERED = "user already registered";
const INVALID_DATA = "invalid data";
const AUTHENTICATION_ERROR = "authentication error";

const statusCodes = {
  [USER_NOT_FOUND]: 401,
  [WRONG_PASSWORD]: 401,
  [USER_ALREADY_REGISTERED]: 409,
  [INVALID_DATA]: 400,
  [AUTHENTICATION_ERROR]: 401,
};

const getStatusCodeByError = (err) => {
  if (Object.keys(statusCodes).includes(err)) {
    return statusCodes[err];
  } else {
    return 500;
  }
};

module.exports = {
  USER_NOT_FOUND,
  WRONG_PASSWORD,
  USER_ALREADY_REGISTERED,
  INVALID_DATA,
  AUTHENTICATION_ERROR,
  getStatusCodeByError,
};
