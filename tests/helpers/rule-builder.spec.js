import RuleBuilder from '../../src/helpers/rule-builder';

describe('rule-set/builder.js', () => {
  it('When a new rule is created it has an empty constraints list', () => {
    const sut = new RuleBuilder();
    expect(sut).toBeInstanceOf(RuleBuilder);
    expect(sut.constraints.count()).toBe(0);
  });
  it('When a ruleBuilder is created with a name it is set', () => {
    const name = 'I am bob';
    const sut = new RuleBuilder(name);
    expect(sut.name).toBe(name);
  });

  it('When a ruleBuilder is copied it was a deep copy', () => {
    const rb = new RuleBuilder();
    const sut = rb.copy();
    expect(sut).toEqual(rb);
    expect(sut).not.toBe(rb);
  });

  it('When a ruleBuilder with a name is copied it was a deep copy', () => {
    const name = 'I am not bob';
    const rb = new RuleBuilder(name);
    const sut = rb.copy();
    expect(sut).toEqual(rb);
    expect(sut).not.toBe(rb);
    expect(sut.name).toBe(name);
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

  it('When must is called on a ruleBuilder with a valid function it adds that function as a constraint', () => {
    const func = (value) => !!value;
    const rb = new RuleBuilder().must(func);
    const sut = rb.constraints.first().must;
    expect(sut).toBe(func);
  });

  it('When must is chained on a ruleBuilder all of the constraints are added to the final builder', () => {
    const func = (value) => !!value;
    const func2 = (value) => !value;
    const rb = new RuleBuilder().must(func).must(func2);
    const sut = rb.constraints;
    expect(sut.first().must).toBe(func);
    expect(sut.last().must).toBe(func2);
  });

  it('When must is not passed a message it defaults to a valid message.', () => {
    const rb = new RuleBuilder().must(() => true);
    const sut = rb.constraints.first().message;
    expect(sut).not.toBeNull();
  });

  it('When must is passed a message on a ruleBuilder it is updated to that message', () => {
    const msg = 'my message';
    const rb = new RuleBuilder().must(() => true, msg);
    const sut = rb.constraints.first().message;
    expect(sut).toBe(msg);
  });

  it('When evaluate is called with one constraint that constraint is evaluated and the result is returned.', () => {
    const func = (value) => !!value;
    const fn = jest.fn(func);
    const rb = new RuleBuilder().must(fn);
    const value = true;

    const result = rb.evaluate(value);
    expect(fn).toBeCalled();
    expect(func(value)).toBe(result);
  });

  it('When evaluate is called with two constraints then each constraint to be called with the value.', () => {
    const fn = jest.fn().mockReturnThis(true);
    const fn2 = jest.fn().mockReturnThis(false);
    const rb = new RuleBuilder().must(fn).must(fn2);
    const value = null;

    rb.evaluate(value);
    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(value);
    expect(fn2).toBeCalledTimes(1);
    expect(fn2).toBeCalledWith(value);
  });

  it('When evaluate is called with a constraint it returns the truthy result of the constraint', () => {
    const fn = (value) => value;
    const rb = new RuleBuilder().must(fn);

    const sut = rb.evaluate(null);
    expect(sut).toBe(false);
  });

  it('When evaluate is called with multiple constraints it returns true if all inputs return truthy', () => {
    const fn = (value) => value;
    const fn1 = (value) => value < 3;
    const fn2 = (value) => value > 1;
    const fn3 = (value) => Math.floor(value) === value;
    const rb = new RuleBuilder().must(fn).must(fn1).must(fn2)
      .must(fn3);

    const value = 2;
    const expected = fn(value) && fn1(value) && fn2(value) && fn3(value);

    const sut = rb.evaluate(value);
    expect(sut).toBe(expected);
  });
});
