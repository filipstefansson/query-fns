import { bracketsFormatter } from '../../src/formatters';
import { parse, stringify } from '../../src';

describe('bracketsFormatter.parse', () => {
  it('can parse a bracket query', () => {
    expect(parse('?foo[]=bar', { formatter: bracketsFormatter })).toEqual({
      foo: ['bar'],
    });
    expect(
      parse('?foo[]=bar&foo[]=baz&foo[]=qux', { formatter: bracketsFormatter }),
    ).toEqual({ foo: ['bar', 'baz', 'qux'] });
  });

  it('can parse query without brackets', () => {
    expect(parse('?foo=bar', { formatter: bracketsFormatter })).toEqual({
      foo: 'bar',
    });
  });

  it('can parse query without with both bracket keys and non bracket keys', () => {
    expect(
      parse('?foo=bar&baz[]=qux', { formatter: bracketsFormatter }),
    ).toEqual({
      foo: 'bar',
      baz: ['qux'],
    });
  });

  it('can decode values', () => {
    expect(parse('?foo=b%20ar', { formatter: bracketsFormatter })).toEqual({
      foo: 'b ar',
    });
  });

  it('can parse without decoding values', () => {
    expect(
      parse('?foo=b%20ar', { formatter: bracketsFormatter, decode: false }),
    ).toEqual({
      foo: 'b%20ar',
    });
  });

  it('can parse array without value', () => {
    expect(parse('?foo[]', { formatter: bracketsFormatter })).toEqual({
      foo: [null],
    });
  });
});

describe('bracketsFormatter.stringify', () => {
  it('can stringify to bracket format', () => {
    expect(
      stringify({ foo: ['bar'] }, { formatter: bracketsFormatter }),
    ).toEqual('foo[]=bar');
    expect(
      stringify(
        { foo: ['bar', 'baz', 'qux'], bar: 'baz' },
        {
          formatter: bracketsFormatter,
        },
      ),
    ).toEqual('foo[]=bar&foo[]=baz&foo[]=qux&bar=baz');
  });

  it('can stringify array with null and empty value', () => {
    expect(
      stringify({ foo: [null] }, { formatter: bracketsFormatter }),
    ).toEqual('foo[]');
    expect(
      stringify({ foo: [], bar: 'baz' }, { formatter: bracketsFormatter }),
    ).toEqual('bar=baz');
    expect(
      stringify(
        { foo: [undefined, null, 'baz'], bar: 'baz' },
        { formatter: bracketsFormatter },
      ),
    ).toEqual('foo[]&foo[]=baz&bar=baz');
  });

  it('can encoding values and keys', () => {
    expect(stringify({ fåo: 'bår' }, { formatter: bracketsFormatter })).toEqual(
      'f%C3%A5o=b%C3%A5r',
    );
  });

  it('can disable encoding for values and keys', () => {
    expect(
      stringify(
        { fåo: ['bår'] },
        { formatter: bracketsFormatter, encode: false },
      ),
    ).toEqual('fåo[]=bår');
    expect(
      stringify(
        { fåo: 'bår' },
        { formatter: bracketsFormatter, encode: false },
      ),
    ).toEqual('fåo=bår');
    expect(stringify({ fåo: null }, { formatter: bracketsFormatter })).toEqual(
      'f%C3%A5o',
    );
    expect(
      stringify({ fåo: null }, { formatter: bracketsFormatter, encode: false }),
    ).toEqual('fåo');
  });
});
