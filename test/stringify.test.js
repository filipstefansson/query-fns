import { stringify } from '../src';

describe('stringify', () => {
  it('should not be null', () => {
    expect(stringify).toBeDefined();
  });

  it('should return a string with matching values', () => {
    expect(stringify({ foo: 'bar' })).toEqual('foo=bar');
  });

  it('it should return a string with multiple values', () => {
    expect(stringify({ foo: 'bar', baz: 'qux' })).toEqual('foo=bar&baz=qux');
  });
});
