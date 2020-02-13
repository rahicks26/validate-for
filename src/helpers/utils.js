const propertyAccessorFromName = (name) => {
  if (typeof name === 'string') {
    const names = name.includes('.') ? name.split('.') : [name];
    return (ctx) => names.reduce((acc, cur) => acc[cur], ctx);
  }
  // We are assuming that if it is not
  // a string the accessor would be invalid
  // All other case will be handled via
  // runtime exceptions when the method is
  // invoked.
  return undefined;
};

export default { propertyAccessorFromName };
