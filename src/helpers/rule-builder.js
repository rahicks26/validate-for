import { List } from 'immutable';
import { cloneDeep } from 'lodash';
import utils from 'get-prop-by-name';

class RuleBuilder {
  constructor(name) {
    this.name = name;
    this.displayName = 'Property';
    this.constraints = List();
    this.cloneContextOnCopy = false;
    this.ctx = {};
    this.getter = null;
  }

  copy(name = null) {
    const copy = cloneDeep(this);
    if (!this.cloneContextOnCopy) {
      copy.ctx = this.ctx;
    }
    if (name) {
      copy.name = name;
      this.getter = utils.propertyAccessorFromName(name);
    }
    return copy;
  }

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

  evaluateFor(ctx) {
    if (ctx) {
      const copy = this.copy();
      try {
        const value = copy.getter(ctx);
        copy.withContext(ctx);
        return copy.evaluate(value);
      } catch (err) {
        return { name: this.name, evalFailed: true, exception: err };
      }
    }
    return { name: this.name, isValid: true };
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
