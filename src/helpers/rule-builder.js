import { List } from 'immutable';
import { cloneDeep } from 'lodash';
import rules from './rules';

class RuleBuilder {
  constructor() {
    this.name = null;
    this.displayName = 'Property';
    this.constraints = new List();
    this.preserveContextRef = false;
    this.ctx = {};
    this.getter = (ctx) => (ctx ? ctx[this.name] : undefined);
  }

  // =======================================
  // Description:
  // Creates a deep clone of the ruleBuilder
  // and is called for each builder method if
  // a change is made. This is to insure that
  // all builders are immutable and that they
  // don't interact with other rules. The one
  // exception here is that you can opt in to
  // keep the reference for the context via
  // withContext.
  // ========================================
  // Returns:
  // A new rule that has been copied based on
  // the configuration of the rule.
  copy() {
    const copy = cloneDeep(this);
    if (this.preserveContextRef) {
      copy.ctx = this.ctx;
    }
    return copy;
  }

  // ==========================================
  // Description:
  // Creates a constraint that is to be combined
  // with every other constraint. All must
  // constraints have to be fulfilled for
  // validate to not return an error.
  // ==========================================
  // Returns:
  // A new rule builder that has been copied
  // via the copy method with this function
  // added to the constraints as a requirement.
  must(func, message = null) {
    if (rules.isFunction(func)) {
      const copy = this.copy();
      const msg = message || 'is in invalid.';
      const constraint = { must: func, message: msg };
      const constraints = this.constraints.push(constraint);
      copy.constraints = constraints;
      return copy;
    }
    return this;
  }

  withDisplayName(name) {
    if (name) {
      const copy = this.copy();
      copy.displayName = name;
      return copy;
    }
    return this;
  }

  withGetter(nameOrFunc) {
    if (nameOrFunc) {
      if (rules.isFunction(nameOrFunc)) {
        const copy = this.copy();
        copy.getter = nameOrFunc;
        return copy;
      }
      if (rules.isString(nameOrFunc)) {
        const copy = this.copy();
        copy.name = nameOrFunc;
        return copy;
      }
    }
    return this;
  }

  // Returns a copy of the rule
  withContext(ctx, notDeepCopied = false) {
    if (ctx) {
      const copy = this.copy();
      copy.ctx = ctx;
      copy.preserveContextRef = notDeepCopied;
      return copy;
    }
    return this;
  }

  evaluate(value) {
    const { ctx } = this;
    const errors = this.constraints.filter((con) => !con.must(value, ctx));
    return errors.isEmpty()
      ? { name: this.name, isValid: true }
      : { name: this.name, isValid: false, error: `${this.displayName} ${errors.first().message}` };
  }

  // Returns evaluate ran under the provided context.
  // This method does not mutate the instance that it is
  // called on. To update the context call 'withContext'.
  evaluateFor(ctx) {
    if (ctx) {
      const copy = this.copy();
      const value = copy.getter(ctx);
      copy.withContext(ctx);
      return copy.evaluate(value);
    }
    return true;
  }

  asFunc(ctx) {
    const rule = this.withContext(ctx);
    return (value) => rule.evaluate(value);
  }
}

export default RuleBuilder;
