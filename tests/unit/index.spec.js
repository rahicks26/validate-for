import { rule, ruleSet, must } from '../../src';
import RuleBuilder from '../../src/helpers/rule-builder';
import RuleSet from '../../src/helpers/rule-set';

describe('Index.js', () => {
  it('when rule is invoked it creates a new ruleBuilder', () => {
    const r = rule();
    expect(r).toBeInstanceOf(RuleBuilder);
  });

  it('when ruleSet is invoked it creates a new RuleSet', () => {
    const r = ruleSet();
    expect(r).toBeInstanceOf(RuleSet);
  });

  it('when must is invoked it creates a new ruleBuilder', () => {
    const r = must();
    expect(r).toBeInstanceOf(RuleBuilder);
  });
});
