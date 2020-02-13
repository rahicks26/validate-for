import { List } from 'immutable';
import RuleBuilder from './rule-builder';

class RuleSet {
  constructor() {
    this.ruleBuilders = new List();
  }

  register(nameOrGetter, rule) {
    if (rule instanceof RuleBuilder) {
      const namedRule = rule.withGetter(nameOrGetter);
      this.ruleBuilders = this.ruleBuilders.push(namedRule);
    }
    return this;
  }

  validate(ctx) {
    return this.ruleBuilders.map((rb, name) => ({ name, error: rb.validateFor(ctx) }));
  }

  validatorFor(name, ctx) {
    if (name) {
      const rule = this.ruleBuilders.get(name);
      if (rule instanceof RuleBuilder) {
        const context = ctx || rule.ctx;
        return rule.asFunc(context);
      }
    }
    return undefined;
  }
}

export default RuleSet;
