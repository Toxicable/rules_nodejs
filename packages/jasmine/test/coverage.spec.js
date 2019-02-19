const {isString} = require('./is-string');

describe('spec in file ending with .test.js', () => {
  it('should get coverage for a branched function', () => {
    expect(isString(3)).toEqual(false);
  });
});
