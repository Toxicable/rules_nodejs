const { isString } = require('./coverage_source');

describe('spec in file ending with _spec.js', () => {
    it('should run', () => {
      expect(isString(2)).toBe(false);
    });
  });
  