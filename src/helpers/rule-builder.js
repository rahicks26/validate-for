/* eslint no-underscore-dangle:
  ["error",
    { "allow":
      ["_name", "_displayName", "_getter", "_ctx", "_constraints", "_cloneContextOnCopy"]
    }]

*/

import { List } from 'immutable';
import { cloneDeep } from 'lodash';
import utils from 'get-prop-by-name';

class RuleBuilder {
  constructor(name) {
    this._name = name;
    this._displayName = 'Property';
    this._constraints = List();
    this._cloneContextOnCopy = false;
    this._ctx = {};
    this._getter = null;
  }

  copy(name = null) {
    const copy = cloneDeep(this);
    if (!this._cloneContextOnCopy) {
      copy._ctx = this._ctx;
    }
    if (name) {
      copy._name = name;
      copy._getter = utils.propertyAccessorFromName(name);
    }
    return copy;
  }

  must(func, message = null) {
    if (typeof func === 'function') {
      const copy = this.copy();
      const msg = message || 'is in invalid.';
      const constraint = { must: func, message: msg };
      const constraints = this._constraints.push(constraint);
      copy._constraints = constraints;
      return copy;
    }
    return this;
  }

  withDisplayName(name) {
    if (name) {
      const copy = this.copy();
      copy._displayName = name;
      return copy;
    }
    return this;
  }

  withGetter(nameOrFunc) {
    const isString = typeof nameOrFunc === 'string';
    if (typeof nameOrFunc === 'function' || isString) {
      const copy = this.copy();
      copy._getter = isString
        ? utils.propertyAccessorFromName(nameOrFunc)
        : nameOrFunc;
      return copy;
    }
    return this;
  }

  withContext(ctx, deepCopied = false) {
    if (ctx) {
      const copy = this.copy();
      copy._ctx = ctx;
      copy._cloneContextOnCopy = deepCopied;
      return copy;
    }
    return this;
  }

  evaluate(value) {
    try {
      const { _ctx: ctx } = this;
      const errors = this._constraints.filter((con) => !con.must(value, ctx));
      return errors.isEmpty()
        ? { name: this._name, isValid: true }
        : { name: this._name, error: `${this._displayName} ${errors.first().message}` };
    } catch (err) {
      return { name: this._name, evalFailed: true, exception: err };
    }
  }

  evaluateFor(ctx) {
    if (ctx) {
      const copy = this.withContext(ctx);
      try {
        const value = copy._getter(ctx);
        return copy.evaluate(value);
      } catch (err) {
        return { name: this._name, evalFailed: true, exception: err };
      }
    }
    return { name: this._name, isValid: true };
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
