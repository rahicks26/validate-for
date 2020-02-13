import { Map } from 'immutable';
import RuleBuilder from './rule-builder';

class RuleSet {
  constructor() {
    this.ruleBuilders = new Map();
  }

  register(name, rule) {
    if (rule instanceof RuleBuilder) {
      const copy = rule.copy();
      copy.name = name;
      this.ruleBuilders = this.ruleBuilders.set(name, copy);
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
