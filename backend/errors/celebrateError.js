const validator = require('validator');
const { CelebrateError } = require('celebrate');

module.exports = function urlValidation(value) {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new CelebrateError('Некорректный URL');
  }
  return value;
};
