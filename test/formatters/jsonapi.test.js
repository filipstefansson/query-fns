import { JSONAPIFormatter } from '../../src/formatters';
import { parse, stringify } from '../../src';

describe('JSONAPIFormatter.parse', () => {
  it('can parse an JSONAPI query', () => {
    expect(
      parse('?foo[bar]=qux&qux=quux', { formatter: JSONAPIFormatter }),
    ).toEqual({ foo: { bar: ['qux'] }, qux: 'quux' });
  });

  it('can parse array value', () => {
    expect(
      parse('?foo[bar]=qux,quux', { formatter: JSONAPIFormatter }),
    ).toEqual({ foo: { bar: ['qux', 'quux'] } });
  });

  it('can parse multiple arrays', () => {
    expect(
      parse('?foo[bar]=qux,quux&bar[foo]=quux,qux', {
        formatter: JSONAPIFormatter,
      }),
    ).toEqual({ foo: { bar: ['qux', 'quux'] }, bar: { foo: ['quux', 'qux'] } });
  });

  it('can parse multiple values with same key', () => {
    expect(
      parse('?foo[bar]=qux,quux&foo[qux]=quux', {
        formatter: JSONAPIFormatter,
      }),
    ).toEqual({ foo: { bar: ['qux', 'quux'], qux: ['quux'] } });
  });

  it('can parse weird keys', () => {
    expect(
      parse('?foo[bar=qux', {
        formatter: JSONAPIFormatter,
      }),
    ).toEqual({ 'foo[bar': 'qux' });
    expect(
      parse('?foobar]=qux', {
        formatter: JSONAPIFormatter,
      }),
    ).toEqual({ 'foobar]': 'qux' });
    expect(
      parse('?foo[bar]a=qux', {
        formatter: JSONAPIFormatter,
      }),
    ).toEqual({ 'foo[bar]a': 'qux' });
    expect(
      parse('?fo[o[bar]=qux', {
        formatter: JSONAPIFormatter,
      }),
    ).toEqual({ fo: { 'o[bar': ['qux'] } });
    expect(
      parse('?foo[[ba]r]=qux', {
        formatter: JSONAPIFormatter,
      }),
    ).toEqual({ foo: { '[ba]r': ['qux'] } });
    expect(
      parse('?foo[[ba]]r]=qux', {
        formatter: JSONAPIFormatter,
      }),
    ).toEqual({ foo: { '[ba]]r': ['qux'] } });
    expect(
      parse('?[foo]=bar,qux', {
        formatter: JSONAPIFormatter,
      }),
    ).toEqual({ '': { foo: ['bar', 'qux'] } });
  });

  it('can parse an empty value', () => {
    expect(
      parse('?foo[bar]', {
        formatter: JSONAPIFormatter,
      }),
    ).toEqual({ foo: { bar: null } });
    expect(
      parse('?foo[bar]&bar[foo]', {
        formatter: JSONAPIFormatter,
      }),
    ).toEqual({ foo: { bar: null }, bar: { foo: null } });
  });

  it('can disable encoding', () => {
    expect(
      parse('?foo[bar]=b%C3%A5z%20', {
        formatter: JSONAPIFormatter,
        decode: false,
      }),
    ).toEqual({ foo: { bar: ['b%C3%A5z%20'] } });
    expect(
      parse('?foo=b%C3%A5z%20', {
        formatter: JSONAPIFormatter,
        decode: false,
      }),
    ).toEqual({ foo: 'b%C3%A5z%20' });
  });
});

describe('JSONAPIFormatter.stringify', () => {
  it('can stringify to an JSONAPI query', () => {
    expect(
      stringify({ foo: { bar: ['qux'] } }, { formatter: JSONAPIFormatter }),
    ).toEqual('foo[bar]=qux');
  });

  it('can stringify non array values', () => {
    expect(
      stringify({ foo: { bar: 'qux' } }, { formatter: JSONAPIFormatter }),
    ).toEqual('foo[bar]=qux');
  });

  it('can stringify multiple keys', () => {
    expect(
      stringify(
        { foo: { bar: ['qux'], qux: ['baz'] } },
        { formatter: JSONAPIFormatter },
      ),
    ).toEqual('foo[bar]=qux&foo[qux]=baz');
  });

  it('can stringify single array value', () => {
    expect(
      stringify(
        { foo: { bar: ['qux', 'baz'] } },
        { formatter: JSONAPIFormatter },
      ),
    ).toEqual('foo[bar]=qux,baz');
  });

  it('can stringify multiple array values', () => {
    expect(
      stringify(
        { foo: { bar: ['qux', 'quux'], qux: ['baz', 'bar'] } },
        { formatter: JSONAPIFormatter },
      ),
    ).toEqual('foo[bar]=qux,quux&foo[qux]=baz,bar');
  });

  it('can stringify non nested array', () => {
    expect(
      stringify({ foo: ['qux', 'baz'] }, { formatter: JSONAPIFormatter }),
    ).toEqual('foo=qux,baz');
  });

  it('can stringify a plain value', () => {
    expect(
      stringify({ foo: 'bar', baz: 'qux' }, { formatter: JSONAPIFormatter }),
    ).toEqual('foo=bar&baz=qux');
  });

  it('can stringify a null value', () => {
    expect(stringify({ foo: null }, { formatter: JSONAPIFormatter })).toEqual(
      'foo',
    );
  });

  it('can URI encode keys and values', () => {
    expect(
      stringify(
        { 'foo bar': { bar: ["q'ux", 'baz'] } },
        { formatter: JSONAPIFormatter },
      ),
    ).toEqual('foo%20bar[bar]=q%27ux,baz');
    expect(stringify({ foo: 'b ar' }, { formatter: JSONAPIFormatter })).toEqual(
      'foo=b%20ar',
    );
  });

  it('can disable URI encoding', () => {
    expect(
      stringify(
        { 'f oo': 'bar' },
        { formatter: JSONAPIFormatter, encode: false },
      ),
    ).toEqual('f oo=bar');
    expect(
      stringify(
        { 'foo bar': { bar: ["q'ux", 'baz'] } },
        { formatter: JSONAPIFormatter, encode: false },
      ),
    ).toEqual("foo bar[bar]=q'ux,baz");
    expect(
      stringify(
        { foo: { bar: 'q ux' } },
        { formatter: JSONAPIFormatter, encode: false },
      ),
    ).toEqual('foo[bar]=q ux');
  });
});
