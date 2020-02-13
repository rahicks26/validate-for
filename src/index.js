import RuleBuilder from './helpers/rule-builder';
import RuleSet from './helpers/rule-set';
import rules from './helpers/rules';

const rule = () => new RuleBuilder();

const ruleSet = () => new RuleSet();

const myModel = {};

// Configure you rule set

const ruleset = ruleSet()
  .register('email',
    rule()
      .must(rules.isEmail)
      .must(rules.isRequired)
      .withContext(myModel))
  .register((ctx) => ctx.userName, // Name can be selected from ctx and after
    rule()
      .must(rules.isString)
      .must(rules.isRequired));

// Create a validator for a rgistered rule
const detachedValidator = ruleset.validatorFor('email', myModel);

// validate the entire model
const result = ruleset.validate(myModel);


export default {
  rule,
};
