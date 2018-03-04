import { parse } from '../src';

describe('parse', () => {
  it('should not be null', () => {
    expect(parse).toBeDefined();
  });

  it('to return an object with matching values', () => {
    expect(parse('foo=bar')).toEqual({ foo: 'bar' });
  });
});
