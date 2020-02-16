import { Map } from 'immutable';
import RuleBuilder from './rule-builder';

class RuleSet {
  constructor() {
    this.ruleBuilders = Map();
  }

  register(name, rule) {
    if (rule instanceof RuleBuilder) {
      const copy = rule.copy(name);
      this.ruleBuilders = this.ruleBuilders.set(name, copy);
    }
    return this;
  }

  validate(ctx) {
    return this.ruleBuilders.map((rb) => rb.evaluateFor(ctx)).toArray();
  }

  validatorFor(name, ctx, deepCopy = false) {
    if (name) {
      const rule = this.ruleBuilders.get(name);
      if (rule instanceof RuleBuilder) {
        return rule.asFunc(ctx, deepCopy);
      }
    }
    return undefined;
  }
}

export default RuleSet;
