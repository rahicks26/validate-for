import { List } from 'immutable';
import { cloneDeep } from 'lodash';
import utils from 'get-prop-by-name';

class RuleBuilder {
  constructor(name) {
    this.name = name;
    this.displayName = 'Property';
    this.constraints = new List();
    this.cloneContextOnCopy = false;
    this.ctx = {};
    this.getter = null;
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
    if (!this.cloneContextOnCopy) {
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
    if (typeof func === 'function') {
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
    const isString = typeof nameOrFunc === 'string';
    if (typeof nameOrFunc === 'function' || isString) {
      const copy = this.copy();
      copy.getter = isString
        ? utils.propertyAccessorFromName(nameOrFunc)
        : nameOrFunc;
      return copy;
    }
    return this;
  }

  // Returns a copy of the rule
  withContext(ctx, deepCopied = false) {
    if (ctx) {
      const copy = this.copy();
      copy.ctx = ctx;
      copy.cloneContextOnCopy = deepCopied;
      return copy;
    }
    return this;
  }

  evaluate(value) {
    try {
      const { ctx } = this;
      const errors = this.constraints.filter((con) => !con.must(value, ctx));
      return errors.isEmpty()
        ? { name: this.name, isValid: true }
        : { name: this.name, error: `${this.displayName} ${errors.first().message}` };
    } catch (err) {
      return { name: this.name, evalFailed: true, exception: err };
    }
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

  asFunc(ctx, deepCopied = false) {
    if (ctx) {
      const context = deepCopied ? cloneDeep(ctx) : ctx;
      const rule = this.withContext(context);
      return (value) => rule.evaluate(value);
    }
    const copy = this.copy();
    return (value, context) => {
      const underCtx = copy.withContext(context, deepCopied);
      return underCtx.evaluate(value);
    };
  }
}

export default RuleBuilder;
