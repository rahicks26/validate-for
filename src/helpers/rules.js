const isNull = (value) => value === null;
const isDefined = (value) => value !== undefined;
const isRequired = (value) => isDefined(value) && !isNull(value);
const isFunction = (value) => typeof value === 'function';
const isBoolean = (value) => typeof value === 'boolean';
const isTrue = (value) => value === true;
const isFalse = (value) => value === false;
const isNumber = (value) => typeof value === 'number';
const isPositive = (value) => isNumber(value) && value > 0;
const isNegative = (value) => isNumber(value) && value < 0;
const isString = (value) => typeof value === 'string';
const isStringWithMaxLength = (value, maxLength) => isString(value)
  && !isNegative(maxLength) && value.length < maxLength;

const isStringWithMinLength = (value, minLength) => isString(value)
  && !isNegative(minLength) && value.length >= minLength;

const isEmail = (value) => {
  if (!isStringWithMaxLength(value, 250)) return false;
  const result = value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/gm);
  return !!result && result.length === 1;
};

const isArray = (value) => Array.isArray(value);

const isNonEmptyArray = (value) => isArray(value) && value.length > 0;

export default {
  isNull,
  isDefined,
  isRequired,
  isFunction,
  isBoolean,
  isTrue,
  isFalse,
  isNumber,
  isPositive,
  isNegative,
  isString,
  isStringWithMaxLength,
  isStringWithMinLength,
  isEmail,
  isArray,
  isNonEmptyArray,
};
