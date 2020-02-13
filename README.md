# Install 

TODO....

# Use
Validate-this leverages the builder pattern to handle validation
for both entire objects and single values. At the heart of this 
project is the rule builder class. To create a new rule use the 
rule method.

```
const myRule = rule();
```

Once you have an instance of a ruleBuilder you will be able to 
use its builder methods to build out custom validation rules. 
Such as:

```
const myRuleWithConstraint = myRule.must(..)
const myRuleWithContext = myRule.withContext(..)
const myRuleWithDisplayName = myRule.withDisplayName(..)
const myRuleWithGetter = myRule.withGetter(..)
```

Each of these methods will return a new instance of the rule
with the requested method applied to only the new instance.
This is to make it easier to chain rule together like so:

```
  const ctx = {prop:'I am hungry'}
  const myRule = rule()
    .must((value)=> !!value)  //Make sure the value is truthy
    .must((value,ctx)=> value !== ctx.prop) // Make sure the value is not equal prop
    .withContext(ctx,true) // Sets the context and makes sure the reference to the original model is preserved

  ctx.prop2 = 'I am Full'

  const myRule2 = myRule
    .withContext(ctx) // Sets the context to be cloned each time this will preserve the state of the context when withContext was called
    .must((value, ctx)=> value !=== ctx.prop2 )

```

Building rules like this can make it easy to share common 
configuration such as all fields are required.


Now to evaluate a rule you have 3 helper functions

```
const myRule = rule.must(v=>v)

// To evaluate against a value all you have to do is pass the value,
// unless the rule needs a context to run.
// If a context is required then an error will be returned with
// cannotEvaluate flag set to true.  
const resultOfSimpleValueCheck = myRule.evaluate(1);

//To evaluate against a model you must have a getter set. Otherwise undefined will be returned
const resultOfValidationForAContext = myRule.withGetter('count').evaluateFor({count:2}) 

const func = myRule
  .must((_,ctx) => ctx.prop.innerProp.contains('I eat squid for breakfast'))
  .withGetter(ctx=>prop.innerProp)
  .withContext({prop:{innerProp:'Not today!'}})
  .asFunc();

// returns {name:null, error:'Property is Invalid', isInvalid:true}
const result = func(1)
```

In addition to the ruleBuilder class 