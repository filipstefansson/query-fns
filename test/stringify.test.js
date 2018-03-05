import { stringify } from '../src';
import { pipeArrayFormatter } from '../src/formatters';

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
    expect(stringify({ foo: null, baz: 'qux' })).toEqual('baz=qux');
    expect(stringify({ foo: undefined, baz: 'qux' })).toEqual('baz=qux');
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
  });

  it('can handle faulty formatters', () => {
    expect(stringify({ foo: 'bar' }, { formatters: [null] })).toEqual(
      'foo=bar',
    );
  });

  it('can stringify to pipe arrays', () => {
    expect(
      stringify(
        {
          foo: ['bar', 'baz'],
          qux: 'quux',
        },
        { formatters: [pipeArrayFormatter] },
      ),
    ).toEqual('foo=bar|baz&qux=quux');
  });

  it('can stringify to pipe arrays and URI encode', () => {
    expect(
      stringify(
        {
          fåå: ['bår', 'båz'],
        },
        { formatters: [pipeArrayFormatter] },
      ),
    ).toEqual('f%C3%A5%C3%A5=b%C3%A5r|b%C3%A5z');
  });

  it('can stringify to pipe arrays and not URI encode', () => {
    expect(
      stringify(
        {
          fåå: ['bår', 'båz'],
        },
        { formatters: [pipeArrayFormatter], encode: false },
      ),
    ).toEqual('fåå=bår|båz');
  });

  it('can stringify to pipe arrays and handle bad input', () => {
    expect(
      stringify(
        {
          foo: ['bar', null, ' ', '', 'baz'],
        },
        { formatters: [pipeArrayFormatter] },
      ),
    ).toEqual('foo=bar|baz');
  });
});
