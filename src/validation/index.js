
import Rules from './helpers/validationRules';

const isModelValidator = payload => payload && payload.model && payload.rules;

const isRule = payload => payload && Rules.isFunction(payload.isValid);

const validate = (model, rules, value) => {
  if (Rules.isNonEmptyArray(rules)) {
    return rules.filter(r => isRule(r))
      .filter(r => (Rules.isDefined(value) ? r.isValid(value) : r.isValid(model)))
      .map(r => r.message || 'Not Valid.');
  }
  return [];
};

const validateModel = (payload) => {
  if (isModelValidator(payload)) {
    const { model, rules } = payload;
    const errors = Object.keys(rules)
      .map(key => validate(model, rules[key]))
      .reduce((acc, cur) => acc.concat(cur), []);

    if (Rules.isNonEmptyArray(errors)) return Promise.reject(errors);
  }
  return Promise.resolve(payload);
};

export const validateFor = (model, rules) => value => validate(model, rules, value);

export const createRule = (isValid, message = 'Not Valid.') => {
  if (Rules.isFunction(isValid)) return { isValid, message };
  throw Error('isValid must be a function with two params. The full model for the object under validation and the current value.');
};

export default validateModel;