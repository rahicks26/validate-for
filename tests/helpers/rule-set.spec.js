import RuleSet from '../../src/helpers/rule-set';
import RuleBuilder from '../../src/helpers/rule-builder';

describe('rule-set/set.js', () => {
  it('When constructed with no prams creates a default set', () => {
    const sut = new RuleSet();
    expect(sut).not.toBeNull();
    expect(sut.ruleBuilders).not.toBeNull();
    expect(sut.ruleBuilders.isEmpty()).toBe(true);
  });

  it('When register is called the provided rule is named and added to the set', () => {
    const rule = new RuleBuilder().must((v) => v === false);
    const rs = new RuleSet();
    rs.register('likesCookies', rule);

    expect(rs.ruleBuilders.isEmpty()).toBe(false);
    expect(rs.ruleBuilders.first().name).toBe('likesCookies');
  });

  it('When register is called the provided rule is not a valid rule instance then it does nothing', () => {
    const rule = null;
    const rs = new RuleSet();
    rs.register('likesCookies', rule);

    expect(rs.ruleBuilders.isEmpty()).toBe(true);
  });
});
