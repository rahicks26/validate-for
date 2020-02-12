class RuleBuilder {
  constructor({
    name = null, constraints = null, model = null, getters = null
  }) {
    this.name = name;
    this.constraints = constraints;
    this.model = model;
    this.getters = getters
  }

  hasName(name) {
    return new RuleBuilder({
      name,
      property: this.property,
      model: this.model,
      constraints: this.constraints,
    });
  }

  must(func, message = null) {
    if (this.value) {
      return new RuleBuilder({
        name: this.name,
        property: this.property,
        model: this.model,
        constraints: this.constraints.concat({ must: func, message }),
      });
    }
    return new RuleBuilder({
      name: this.name,
      property: this.property,
      model: this.model,
      constraints: [{ must: func, message }],
    });
  }

  cannot(func, message = null){
    return this.must((value) => !func(value), message);
  }

  withGetter(getter){

  }

  validateFor(model) {
    return new RuleBuilder({
      name: this.name,
      property: this.property,
      model,
      constraints: this.constraints,
    });
  }

  validate(value){
    return true;
  }
  
  asFunc(){
    return this.name;
  }
}

export default RuleBuilder