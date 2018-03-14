# [search-params](https://github.com/filipstefansson/search-params) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/filipstefansson/search-params/blob/master/LICENSE) [![Coverage Status](https://img.shields.io/coveralls/filipstefansson/search-params/master.svg?style=flat)](https://coveralls.io/github/filipstefansson/search-params?branch=master) [![CircleCI Status](https://circleci.com/gh/filipstefansson/search-params.svg?style=shield&circle-token=ab2228bfc68a2fe6184b96d9fb7436f29a6d1b10)](https://circleci.com/gh/filipstefansson/search-params) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/filipstefansson/search-params#contributing)

Parse and stringify URL search params.

## Installation

```
yarn add search-params
```

or

```
npm install search-params
```

## Usage

Import the package using:

```js
import { stringify, parse } from 'search-params';
```

or specify what to import to save some bytes:

```js
import stringify from 'search-params/stringify';
import parse from 'search-params/parse';
```

### Parse

Use the `parse` method to convert a query string in to an object.

```js
parse('?foo=bar');
// => { foo: 'bar' }

parse('?foo=bar&baz=qee');
// => { foo: 'bar', baz: 'qee' }
```

### Stringify

Use the `stringify` method to convert an object in to a query string.

```js
stringify({ foo: 'bar' });
// => foo=bar

stringify({ foo: 'bar', baz: 'qee' });
// => foo=bar&baz=qee
```

## API

### parse(string, options) => Object

option              | default          | description |
--------------------|------------------|-------------|
decode              | `true`           | Use `decodeURIComponent` on the keys and values before adding them to the returned object. |
formatter           | `default`        | See [formatters section](#formatters). |

### stringify(object, options) => string

option              | default          | description |
--------------------|------------------|-------------|
encode              | `true`           | Use `encodeURIComponent` on the keys and values before adding them to the returned string. |
formatter           | `default`        | See [formatters section](#formatters). |

## Formatters

Since there is more than one way of formatting a query string, we need a way 
of telling the library how to stringify and parse the input. For this we have 
*formatters*. 

There is a default formatter used that will work for most cases, but if you need 
something more advanced like arrays or nested objects you can use a 
*custom formatter*.

To use a custom formatter, simply import it and tell the `parse` or `stringify`
method to use it.

```js
import { JSONAPIFormatter } from 'search-params/formatters';
// import JSONAPIFormatter from 'search-params/formatters/jsonapi';

parse('?foo[bar]=qux', { formatter: JSONAPIFormatter });
// => { foo: { bar: ['qux'] } }
```

### Built-in formatters

#### defaultFormatter

stringify         | parse                        |
------------------|------------------------------|
`foo=bar`         | `{ foo: 'bar' }`             |
`foo=bar&bar=baz` | `{ foo: 'bar', bar: 'baz' }` |
`foo=bar&foo=baz` | `{ foo: ['bar', 'baz'] }`    |

#### JSONAPIFormatter

stringify                    | parse                                              |
-----------------------------|----------------------------------------------------|
`?foo[bar]=qux`              | `{ foo: { bar: ['qux'] } }`                        |
`?foo[bar]=qux,baz`          | `{ foo: { bar: ['qux', 'baz'] } }`                 |
`?foo[bar]=qux&bar[foo]=baz` | `{ foo: { bar: ['qux'] }, bar: { foo: ['baz'] } }` |

### Create your own formatter

If none of the built-in formatters supports your format, it's easy to build your
own. A formatter is an object with two properties with functions 
as values; `parse` and `stringify`.

```js
const myCustomFormatter = {
  parse: (key, value, accumulator, options) => { key: '', value: {} },
  stringify: (key, value, source, options) => '',
};

parse('?foo=bar', { formatter: myCustomFormatter });
stringify({ foo: 'bar' }, { formatter: myCustomFormatter });
```

#### parse(key, value, accumulator, options) => { key: string, value: any }

The parse function will split the query string at every `&` and run your
formatter on every value in that array.

The expected return is an `Object` containing `{ key: string, value: any }`.

parameter        | type          | description                                         |
-----------------|---------------|-----------------------------------------------------|
key              | `string`      | Whatever is on the left side of the `=`.            |
value            | `string`      | Whatever is on the right side of the `=`.           |
accumulator      | `string`      | The current output value.                           |
options          | `Object`      | [The options object](#parsestring-options--object). |

*Important:* If you build your own formatter, it's up to you to consider the 
user options like `decode`. The library won't do any formatting for you.

#### stringify(key, value, source, options) => string

The stringify function will run your formatter for every `key: value` of the
input value, and it's up to your formatter to reduce that in to an string.

The expected return is a `string`.

parameter        | type          | description                                             |
-----------------|---------------|---------------------------------------------------------|
key              | `string`      | The property key.                                       |
value            | `any`         | The value for the current key.                          |
source           | `Object`      | The object the user put in.                             |
options          | `Object`      | [The options object](#stringifyobject-options--string). |

*Important:* If you build your own formatter, it's up to you to consider the 
user options like `encode`. The library won't do any formatting for you.

## Develop

If you want to improve the library, the easiest way to get started is by cloning
the repo, and then running:

```
yarn install
yarn start
```

This will start [jest](https://facebook.github.io/jest/) in `watch mode`. In
this way you can develop new features and make sure that everything is working 
as it should.

The recommended way of creating new features or formatters is to first create 
the tests in either `test/parse.test.js` or `test/stringify.test.js`, and then 
make sure that they pass. 

It's also recommended that you run `yarn start` with the `--coverage` flag 
before submitting any pull requests, to make sure that all your new code has
test coverage.

## Contributing

You can contribute by 
[submitting an issue](https://github.com/filipstefansson/search-params/issues)
or by creating a new pull request. 

### Issues and bugs

If you've discoved a bug, please create a new issue including the steps to 
reproduce the problem.

### Pull requests

If you want to help improve this library, feel free to create a pull request
with new features or bugfixes. 

The aim is to have:
  * 90%+ [flow](https://flow.org/) coverage
  * 100% test coverage

To check this, refer to the [develop](#develop) section.
