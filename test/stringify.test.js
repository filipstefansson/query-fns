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

  it('should return empty string when input is invalid', () => {
    expect(stringify()).toEqual('');
    expect(stringify('')).toEqual('');
    expect(stringify(0)).toEqual('');
    expect(stringify(' ')).toEqual('');
  });

  it('should handle empty values', () => {
    expect(stringify({ foo: null, baz: 'qux', qux: ' ' })).toEqual(
      'foo&baz=qux',
    );
    expect(stringify({ foo: undefined, baz: 'qux' })).toEqual('baz=qux');
  });

  it('should handle arrays', () => {
    expect(stringify({ foo: ['bar', 'qux'], baz: 'qux' })).toEqual(
      'foo=bar&foo=qux&baz=qux',
    );
  });

  it('should handle arrays without encoding', () => {
    expect(
      stringify({ foo: ['bar', 'qux'], baz: 'qux' }, { encode: false }),
    ).toEqual('foo=bar&foo=qux&baz=qux');
  });

  it('should handle arrays with bad values', () => {
    expect(stringify({ foo: [' ', 'bar', null], bar: Object })).toEqual(
      'foo=bar',
    );
  });

  it('should handle empty array', () => {
    expect(stringify({ foo: [], baz: 'qux' })).toEqual('baz=qux');
  });

  it('can URI encode keys and values', () => {
    // eslint-disable-next-line prettier/prettier
    expect(stringify({ 'foo bar': 'baz\'qux' })).toEqual('foo%20bar=baz%27qux');
    expect(stringify({ 'foo bår': 'baz=qux' })).toEqual(
      'foo%20b%C3%A5r=baz%3Dqux',
    );
  });

  it('can disable URI encoding', () => {
    expect(stringify({ 'foo bar': "baz'qux" }, { encode: false })).toEqual(
      "foo bar=baz'qux",
    );
    expect(stringify({ fåo: null }, { encode: false })).toEqual('fåo');
  });

  it('can handle faulty formatters', () => {
    expect(stringify({ foo: 'bar' }, { formatters: [null] })).toEqual(
      'foo=bar',
    );
  });
});
