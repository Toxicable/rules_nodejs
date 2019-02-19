const {myFunction} = require('./is-string');

describe('spec in file ending with .test.js', () => {
  it('should get coverage for a branched function', () => {
    expect(myFunction(3)).toEqual(false);
  });
});
