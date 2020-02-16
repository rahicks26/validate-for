import RuleBuilder from './helpers/rule-builder';
import RuleSet from './helpers/rule-set';

export const rule = () => new RuleBuilder();

export const must = (func, message) => new RuleBuilder().must(func, message);

export const ruleSet = () => new RuleSet();

export default {
  rule,
  must,
  ruleSet,
};
