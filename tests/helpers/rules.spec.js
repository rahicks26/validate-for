import rules from '../../src/helpers/rules';

describe('ValidationRules.js', () => {
  it('When isNull is passed null returns true', () => {
    const value = null;
    const result = rules.isNull(value);
    expect(result).toBe(true);
  });
  it('When isNull is not passed null returns false', () => {
    const value = 'null';
    const result = rules.isNull(value);
    expect(result).toBe(false);
  });
  it('When isDefined is passed a defined value returns true', () => {
    const value = null;
    const result = rules.isDefined(value);
    expect(result).toBe(true);
  });
  it('When isDefined is passed undefined returns false', () => {
    const value = undefined;
    const result = rules.isDefined(value);
    expect(result).toBe(false);
  });
  it('When isFunction is passed a function returns true', () => {
    const value = () => {};
    const result = rules.isFunction(value);
    expect(result).toBe(true);
  });
  it('When isFunction is not passed a function returns false', () => {
    const value = undefined;
    const result = rules.isFunction(value);
    expect(result).toBe(false);
  });
  it('When isBoolean is passed a boolean returns true', () => {
    const value = true;
    const result = rules.isBoolean(value);
    expect(result).toBe(true);
  });
  it('When isBoolean is not passed a boolean returns false', () => {
    const value = undefined;
    const result = rules.isBoolean(value);
    expect(result).toBe(false);
  });
  it('When isNumber is passed a number returns true', () => {
    const value = 1;
    const result = rules.isNumber(value);
    expect(result).toBe(true);
  });
  it('When isNumber is not passed a number returns false', () => {
    const value = '1';
    const result = rules.isNumber(value);
    expect(result).toBe(false);
  });
  it('When isPositive is passed a positive number returns true', () => {
    const value = 1;
    const result = rules.isPositive(value);
    expect(result).toBe(true);
  });
  it('When isPositive is not passed a positive number returns false', () => {
    const value = 0;
    const result = rules.isPositive(value);
    expect(result).toBe(false);
  });
  it('When isNegative is passed a negative number returns true', () => {
    const value = -1;
    const result = rules.isNegative(value);
    expect(result).toBe(true);
  });
  it('When isNegative is not passed a negative number returns false', () => {
    const value = 0;
    const result = rules.isNegative(value);
    expect(result).toBe(false);
  });
  it('When isSting is passed a string returns true', () => {
    const value = '';
    const result = rules.isString(value);
    expect(result).toBe(true);
  });
  it('When isSting is not passed a string returns false', () => {
    const value = null;
    const props = { maxLength: 5 };
    const result = rules.isString(value, props);
    expect(result).toBe(false);
  });
  it('When isStringWithinLength is not passed a string returns false', () => {
    const value = null;
    const result = rules.isStringWithMaxLength(value);
    expect(result).toBe(false);
  });
  it('When isStringWithinLength is passed a string without length returns false', () => {
    const value = 'null';
    const result = rules.isStringWithMaxLength(value);
    expect(result).toBe(false);
  });
  it('When isStringWithinLength is passed a string with negative value returns false', () => {
    const value = 'null';
    const length = -5;
    const result = rules.isStringWithMaxLength(value, length);
    expect(result).toBe(false);
  });
  it('When isStringWithinLength is passed a string less than the length returns true', () => {
    const value = 'null';
    const length = 5;
    const result = rules.isStringWithMaxLength(value, length);
    expect(result).toBe(true);
  });
  it('When isSting is not passed a string greater than or equal to the length returns false', () => {
    const value = 'null';
    const length = 4;
    const result = rules.isStringWithMaxLength(value, length);
    expect(result).toBe(false);
  });
  it('When isEmail is not passed a string returns false', () => {
    const value = null;
    const result = rules.isEmail(value);
    expect(result).toBe(false);
  });
  it('When isEmail is not passed an email returns false', () => {
    const value = 'testing';
    const result = rules.isEmail(value);
    expect(result).toBe(false);
  });
  it('When isEmail is passed an email returns true', () => {
    const value = 'test@dev.com';
    const result = rules.isEmail(value);
    expect(result).toBe(true);
  });
  it('When isEmail is passed multiple emails returns false', () => {
    const value = 'test@dev.com  dev@test.com';
    const result = rules.isEmail(value);
    expect(result).toBe(false);
  });
  it('When isEmail is passed a string of 250 characters returns false', () => {
    const value = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium.';
    const result = rules.isEmail(value);
    expect(result).toBe(false);
  });
  it('When isUserName is not passed a string returns false', () => {
    const value = null;
    const result = rules.isEmail(value);
    expect(result).toBe(false);
  });
  it('When isUserName is not passed an email returns false', () => {
    const value = 'testing';
    const result = rules.isEmail(value);
    expect(result).toBe(false);
  });
});
