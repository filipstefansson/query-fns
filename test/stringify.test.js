import { stringify } from '../src';
import { JSONAPIFormatter } from '../src/formatters';

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
    expect(stringify({ foo: null, baz: 'qux', qux: ' ' })).toEqual('baz=qux');
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
  });

  it('can handle faulty formatters', () => {
    expect(stringify({ foo: 'bar' }, { formatters: [null] })).toEqual(
      'foo=bar',
    );
  });

  it('can stringify to json api', () => {
    expect(
      stringify({ foo: { bar: ['qux'] } }, { formatter: JSONAPIFormatter }),
    ).toEqual('foo[bar]=qux');
  });

  it('can stringify non array to json api', () => {
    expect(
      stringify({ foo: { bar: 'qux' } }, { formatter: JSONAPIFormatter }),
    ).toEqual('foo[bar]=qux');
  });

  it('can stringify multiple values to json api', () => {
    expect(
      stringify(
        { foo: { bar: ['qux'], qux: ['baz'] } },
        { formatter: JSONAPIFormatter },
      ),
    ).toEqual('foo[bar]=qux&foo[qux]=baz');
  });

  it('can stringify multiple values with arrays to json api', () => {
    expect(
      stringify(
        { foo: { bar: ['qux', 'quux'], qux: ['baz', 'bar'] } },
        { formatter: JSONAPIFormatter },
      ),
    ).toEqual('foo[bar]=qux,quux&foo[qux]=baz,bar');
  });

  it('can stringify array to json api', () => {
    expect(
      stringify(
        { foo: { bar: ['qux', 'baz'] } },
        { formatter: JSONAPIFormatter },
      ),
    ).toEqual('foo[bar]=qux,baz');
  });

  it('can jsonapi stringify non nested array', () => {
    expect(
      stringify({ foo: ['qux', 'baz'] }, { formatter: JSONAPIFormatter }),
    ).toEqual('foo=qux,baz');
  });

  it('can jsonapi stringify plain value', () => {
    expect(
      stringify({ foo: 'bar', baz: 'qux' }, { formatter: JSONAPIFormatter }),
    ).toEqual('foo=bar&baz=qux');
  });

  it('can jsonapi stringify plain value', () => {
    expect(
      stringify({ foo: 'bar', baz: 'qux' }, { formatter: JSONAPIFormatter }),
    ).toEqual('foo=bar&baz=qux');
  });

  it('can jsonapi stringify a bad value', () => {
    expect(stringify({ foo: null }, { formatter: JSONAPIFormatter })).toEqual(
      'foo',
    );
  });
});
