

export const rule = (name = null) => new RuleBuilder({name});

export const fromFunc = (func, message = null) => 
  rule().must(func, message);

export default { rule, fromFunc };