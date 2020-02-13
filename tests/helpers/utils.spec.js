import utils from '../../src/helpers/utils';

describe('utils.js', () => {
  it('When propertyAccessorFromName is called with a value that is not a string undefined', () => {
    const value = null;
    const sut = utils.propertyAccessorFromName(value);
    expect(sut).toBe(undefined);
  });

  it('When propertyAccessorFromName is called with a string that does not contain "." it is used as the property name', () => {
    const value = 'name';
    const obj = { name: 'bob' };
    const sut = utils.propertyAccessorFromName(value);
    expect(sut(obj)).toBe(obj.name);
  });

  it('When propertyAccessorFromName is called with a string that does contain "." it is split and applied in sequence as property names', () => {
    const value = 'member.leader.profile.name';
    const obj = { member: { leader: { profile: { name: 'bob' } } } };
    const sut = utils.propertyAccessorFromName(value);
    expect(sut(obj)).toBe(obj.member.leader.profile.name);
  });

  it('When propertyAccessorFromName is pass an invalid property name the accessor will return undefined or throw a TypeError', () => {
    try {
      const value = 'name.letters';
      const obj = { name: 'hahahah' };
      const sut = utils.propertyAccessorFromName(value);
      expect(sut(obj)).toBe(undefined);
      sut({ n: 'mahahahaha' });
    } catch (err) {
      expect(err).toBeInstanceOf(TypeError);
    }
  });
});
