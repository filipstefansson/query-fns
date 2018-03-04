import { parse } from '../src';

describe('parse', () => {
  it('should not be null', () => {
    expect(parse).toBeDefined();
  });

  it('to return an object with matching values', () => {
    expect(parse('foo=bar')).toEqual({ foo: 'bar' });
  });

  it('can parse multiple values', () => {
    expect(parse('foo=bar&baz=qux')).toEqual({ foo: 'bar', baz: 'qux' });
  });

  it('can parse multiple values with same key', () => {
    expect(parse('foo=bar&foo=baz')).toEqual({ foo: ['bar', 'baz'] });
  });

  it('preserves order of multiple keys', () => {
    expect(parse('foo=bar&foo=baz')).toEqual({ foo: ['bar', 'baz'] });
    expect(parse('foo=baz&foo=bar')).toEqual({ foo: ['baz', 'bar'] });
  });

  it('can parse string without a value', () => {
    expect(parse('foo')).toEqual({ foo: null });
    expect(parse('foo&bar')).toEqual({ foo: null, bar: null });
    expect(parse('foo&bar=baz')).toEqual({ foo: null, bar: 'baz' });
    expect(parse('foo&foo')).toEqual({ foo: [null, null] });
  });

  it('returns empty object if keys are missing', () => {
    expect(parse()).toEqual({});
    expect(parse('')).toEqual({});
    expect(parse(' ')).toEqual({});
    expect(parse('#')).toEqual({});
    expect(parse('?')).toEqual({});
  });

  it('can parse strings starting with ?&#', () => {
    expect(parse('?foo=bar')).toEqual({ foo: 'bar' });
    expect(parse('#foo=bar')).toEqual({ foo: 'bar' });
    expect(parse('&foo=bar')).toEqual({ foo: 'bar' });
  });

  it('returns empty object if input is not a string', () => {
    expect(parse({})).toEqual({});
  });

  it('can handle embedded `=`', () => {
    expect(parse('foo=bar%3Dbaz')).toEqual({ foo: 'bar=baz' });
    expect(parse('foo=bar=baz')).toEqual({ foo: 'bar=baz' });
  });

  it('can handle keys that conflict with object properties', () => {
    expect(parse('hasOwnProperty=foo')).toEqual({ hasOwnProperty: 'foo' });
  });

  it('can decode keys and values', () => {
    expect(parse('f%C3%A5%C3%A5=bar')).toEqual({ fåå: 'bar' });
    expect(parse('foo=b%C3%A5r')).toEqual({ foo: 'bår' });
  });
});
