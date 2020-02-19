import RuleSet from '../../../src/helpers/rule-set';
import RuleBuilder from '../../../src/helpers/rule-builder';

describe('rule-set/set.js', () => {
  it('When constructed with no prams creates a default set', () => {
    const sut = new RuleSet();
    expect(sut).toBeInstanceOf(RuleSet);
  });

  it('When register is called the provided rule is not a valid rule instance then it does nothing', () => {
    const rule = null;
    const rs = new RuleSet();
    rs.register('likesCookies', rule);

    expect(rs.ruleBuilders.isEmpty()).toBe(true);
  });

  it('When validate is called it validates all rules and returns the results', () => {
    const rs = new RuleSet();
    rs.register('rule 1', new RuleBuilder().must((v) => v === 1).withGetter((c) => c.rule1))
      .register('rule 2', new RuleBuilder().must((v) => v === 2).withGetter('rule2'));

    const sut = rs.validate({ rule1: 1, rule2: 2 });
    expect(sut).toBeDefined();
    expect(sut.length).toBe(2);
  });

  it('When validatorFor is called it creates a validator for the rule with that name with the given context', () => {
    const rs = new RuleSet();
    rs.register('rule 1', new RuleBuilder().must((v, c) => v === 1 || v === c.rule2).withGetter((c) => c.rule1))
      .register('rule 2', new RuleBuilder().must((v) => v === 2).withGetter('rule2'));

    const sut = rs.validatorFor('rule 1', { rule2: 10 });
    expect(sut(1).isValid).toBe(true);
    expect(sut(10).isValid).toBe(true);
    expect(sut(2).isValid).toBe(undefined);
  });

  it('When validateFor is called for an unregistered rule it returns undefined', () => {
    const rs = new RuleSet();
    rs.register('rule 1', new RuleBuilder().must((v, c) => v === 1 || v === c.rule2).withGetter((c) => c.rule1))
      .register('rule 2', new RuleBuilder().must((v) => v === 2).withGetter('rule2'));

    const sut = rs.validatorFor('rule 3', { rule2: 10 });
    expect(sut).toBe(undefined);
  });

  it('When validateFor is called and the name is falsy it returns undefined', () => {
    const rs = new RuleSet();
    rs.register('rule 1', new RuleBuilder().must((v, c) => v === 1 || v === c.rule2).withGetter((c) => c.rule1))
      .register('rule 2', new RuleBuilder().must((v) => v === 2).withGetter('rule2'));

    const sut = rs.validatorFor('', { rule2: 10 });
    expect(sut).toBe(undefined);
  });

  it('When a rule is named the name is used as a default getter', () => {
    const rs = new RuleSet();
    rs.register('name', new RuleBuilder().must((v) => v === 'name'));
    const sut = rs.validate({ name: 'name' });
    expect(sut.filter((r) => !r.isValid)).toBe([]);
  });
});
