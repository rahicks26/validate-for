import RuleBuilder from './helpers/rule-builder';
import RuleSet from './helpers/rule-set';

const rule = () => new RuleBuilder();

const ruleSet = () => new RuleSet();

export default {
  rule,
  ruleSet,
};
