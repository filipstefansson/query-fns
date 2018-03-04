import { stringify } from '../src';

describe('stringify', () => {
  it('should not be null', () => {
    expect(stringify).toBeDefined();
  });

  it('to return a string with matching values', () => {
    expect(stringify({ foo: 'bar' })).toEqual('foo=bar');
  });
});
