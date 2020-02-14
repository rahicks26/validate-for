import RuleBuilder from '../../src/helpers/rule-builder';

describe('rule-set/builder.js', () => {
  it('When a rule is created it does not need a name', () => {
    const sut = new RuleBuilder();
    expect(sut).toBeInstanceOf(RuleBuilder);
  });

  it('When withContext is called it creates a new rule instance', () => {
    const ctx = { name: 'name' };
    const rb = new RuleBuilder();
    const sut = rb.withContext(ctx, true);
    expect(sut).not.toBe(rb);
  });

  it('When withContext is called with a falsy ctx it returns the current instance', () => {
    const ctx = null;
    const rb = new RuleBuilder();
    const sut = rb.withContext(ctx, true);
    expect(sut).toBe(rb);
  });

  it('When a ruleBuilder is copied it was a deep copy', () => {
    const rb = new RuleBuilder();
    const sut = rb.copy();
    expect(sut).toEqual(rb);
    expect(sut).not.toBe(rb);
  });

  it('When withDisplayName is called it returns an new instance of a ruleBuilder', () => {
    const name = 'bob';
    const rb = new RuleBuilder();
    const sut = rb.withDisplayName(name);
    expect(sut).not.toBe(rb);
  });

  it('When withDisplayName is called it returns an new instance of a ruleBuilder', () => {
    const name = 'bob';
    const rb = new RuleBuilder();
    const sut = rb.withDisplayName(name);
    expect(sut).not.toBe(rb);
  });

  it('When must is called on a ruleBuilder without providing a valid function the same instance is returned', () => {
    const rb = new RuleBuilder();
    const sut = rb.must();
    expect(rb).toBe(sut);
  });

  it('When must is called on a ruleBuilder with a valid function a new rule builder is returned', () => {
    const rb = new RuleBuilder();
    const sut = rb.must(() => true);
    expect(rb).not.toBe(sut);
  });

  it('When must is called on a ruleBuilder with a valid function an a message the message will be returned on errors for that rule', () => {
    const rb = new RuleBuilder();
    const msg = 'Hi!';
    const sut = rb.must((v) => v === true, msg).evaluate(false);
    expect(sut.error).toContain(msg);
  });

  it('When evaluate is called with one constraint that constraint is evaluated and the result is returned.', () => {
    const func = (value) => !!value;
    const fn = jest.fn(func);
    const rb = new RuleBuilder().must(fn);
    const value = true;

    const result = rb.evaluate(value);
    expect(fn).toBeCalled();
    expect(result.message).not.toBeNull();
  });

  it('When evaluate is called with two constraints then each constraint to be called with the value.', () => {
    const ctx = {};
    const fn = jest.fn().mockReturnThis(true);
    const fn2 = jest.fn().mockReturnThis(false);
    const rb = new RuleBuilder().must(fn).must(fn2).withContext(ctx);
    const value = null;

    rb.evaluate(value);
    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(value, ctx);
    expect(fn2).toBeCalledTimes(1);
    expect(fn2).toBeCalledWith(value, ctx);
  });

  it('When evaluate is called with a constraint and an invalid value the invalid flag is set to true.', () => {
    const fn = (value) => value;
    const rb = new RuleBuilder().must(fn);

    const sut = rb.evaluate(null);
    expect(sut.isValid).toEqual(undefined);
  });

  it('When evaluate is called with multiple constraints it returns an object with isValid set to true if all inputs return truthy', () => {
    const fn = (value) => !!value;
    const fn1 = (value) => value < 3;
    const fn2 = (value) => value > 1;
    const fn3 = (value) => Math.floor(value) === value;
    const rb = new RuleBuilder().must(fn, 'err 0').must(fn1, 'err 1').must(fn2, 'err 2')
      .must(fn3, 'err 3');

    const v = 2;

    const sut = rb.evaluate(v);
    expect(sut.isValid).toBe(true);
  });

  it('When withDisplayName is called with an undefined name the default name is still used', () => {
    const sut = new RuleBuilder().withDisplayName(null).must((v) => v === 1).evaluate(2);
    expect(sut.error).toContain('Property');
  });

  it('When withDisplay is called and the a valid string is passed the error will contain that display name', () => {
    const displayName = 'Error';
    const sut = new RuleBuilder().withDisplayName(displayName).must((v) => v === 1).evaluate(2);
    expect(sut.error).toContain(displayName);
  });

  it('When withContext is called in the chain and a rule uses the context it will be used', () => {
    const ctx = { name: 'bob' };
    const sut = new RuleBuilder().withContext(ctx).must((v, c) => v === c.name).evaluate(ctx.name);
    expect(sut.isValid).toBe(true);
  });

  it('When with getter is set by name that name will be used when evaluateFor is called', () => {
    const ctx = { type: 'ford' };
    const sut = new RuleBuilder().withContext(ctx).withGetter('type').must((v) => v.includes('f'))
      .evaluateFor({ type: 'dodge' });
    expect(sut.isValid).toBe(undefined);
  });

  it('When withGetter is set by function the function will be used when evaluateFor is called', () => {
    const ctx = { type: 'ford' };
    const fn = jest.fn((c) => c.type);
    const sut = new RuleBuilder().withContext(ctx).withGetter(fn).must((v) => v.includes('f'))
      .evaluateFor(ctx);
    expect(fn).toBeCalled();
    expect(fn).toBeCalledWith(ctx);
    expect(sut.isValid).toBe(true);
  });

  it('When withGetter is called and the param is falsy it has no effect', () => {
    try {
      const ctx = { type: 'ford' };
      const sut = new RuleBuilder().withContext(ctx).withGetter().must((v) => v.includes('f'))
        .evaluateFor({ type: 'dodge' });
      expect(sut.isValid).toBe(undefined);
    } catch (err) {
      expect(err).toBeInstanceOf(TypeError);
    }
  });

  it('When a must constraint cannot evaluate the expression b/c of an exception an error is returned', () => {
    const ctx = { type: 'ford' };
    const sut = new RuleBuilder().withContext(ctx).must((v) => v.incls('f')).evaluate('tom');
    expect(sut.evalFailed).toBe(true);
  });

  it('When evaluateFor is called with out a getter being set an error is returned', () => {
    const ctx = { type: 'ford' };
    const sut = new RuleBuilder().withContext(ctx).must((v) => v.includes('f')).evaluateFor({ type: 'boss' });
    expect(sut.evalFailed).toBe(true);
  });

  it('When evaluateFor is passed a falsy ctx it returns isValid as true', () => {
    const ctx = { type: 'ford' };
    const sut = new RuleBuilder().withContext(ctx).must((v) => v.includes('f')).evaluateFor(null);
    expect(sut.isValid).toBe(true);
  });

  it('When asFunc is called it returns a function', () => {
    const rb = new RuleBuilder().must((v) => !!v).withGetter('home');

    const sut0 = rb.asFunc();
    expect(sut0).toBeInstanceOf(Function);

    const sut1 = rb.asFunc({ home: 'boston' });
    expect(sut1).toBeInstanceOf(Function);
  });

  it('When asFunc is called with a ctx the context is captured in the func', () => {
    const rb = new RuleBuilder().must((v, c) => v === c.home).withGetter('home');

    const sut = rb.asFunc({ home: 'boston' });
    expect(sut).toBeInstanceOf(Function);
    expect(sut('boston').isValid).toBe(true);
    expect(sut('austin').isValid).toBe(undefined);
  });

  it('When asFunc is called without a context it can be passed in', () => {
    const rb = new RuleBuilder().must((v, c) => v === c.home).withGetter('home');

    const sut = rb.asFunc();
    expect(sut).toBeInstanceOf(Function);
    expect(sut('boston', { home: 'boston' }).isValid).toBe(true);
    expect(sut('austin', { home: 'boston' }).isValid).toBe(undefined);
  });

  it('When the cosntext is set to deep copy it does not get udpated by the the instance', () => {
    const ctx = { base: 'LRAF' };
    const rb = new RuleBuilder().withContext(ctx, true).must((v, c) => c.includes('Q') && v.includes('Q'));
    ctx.base = 'QRX';
    const sut0 = rb.evaluate('Q');
    expect(sut0.isValid).toBe(undefined);
  });

  it('When the cosntext is set to deep copy it does not get udpated by the the instance', () => {
    const ctx = { base: 'LRAF' };
    const rb = new RuleBuilder().withContext(ctx).must((v, c) => c.base.includes('Q') && v.includes('Q'));
    ctx.base = 'QRX';
    const sut0 = rb.evaluate('Q');
    expect(sut0.isValid).toBe(true);
  });

  it('When asFunc is called with a ctx the context can be set to be deep copied', () => {
    const rb = new RuleBuilder().must((v, c) => v === c.home).withGetter('home');
    const ctx = { home: 'boston' };
    const sut = rb.asFunc(ctx, true);
    ctx.home = null;
    expect(sut).toBeInstanceOf(Function);
    expect(sut('boston').isValid).toBe(true);
    expect(sut('austin').isValid).toBe(undefined);
  });
});
