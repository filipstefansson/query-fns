/* @flow */
import {
  type Formatters,
  type Formatter,
  defaultFormatter,
} from './formatters';

export type Param = {
  key: string,
  value: ?string,
};

type StringifyOptions = {
  formatters: Formatters,
  encode: boolean,
};

// https://github.com/kevva/strict-uri-encode/blob/master/index.js
const encodeString: Function = (value: string): string =>
  encodeURIComponent(value).replace(
    /[!'()*]/g,
    (match: string) =>
      `%${match
        .charCodeAt(0)
        .toString(16)
        .toUpperCase()}`,
  );

/**
 * Create a query string from an object
 *
 * @param  {Object} params Object with params
 * @return {string}        A query string
 */
export default (params: ?Object, opts: StringifyOptions): string => {
  if (!params || typeof params !== 'object') return '';

  // create options
  const options: StringifyOptions = Object.assign(
    {},
    {
      formatters: [],
      encode: true,
    },
    opts,
  );
  const { formatters, encode }: StringifyOptions = options;

  // create new params object
  const paramsObject: Object = Object.assign({}, params);

  // go through params and create array of key=value strings
  const paramsArray: string[] = Object.keys(paramsObject)
    // remove items where value is empty
    .filter((key: string) => {
      const value: ?string | (?string)[] = paramsObject[key];
      return value !== '' && value && value.length > 0;
    })
    .map((key: string) => {
      const value: string = paramsObject[key];

      // pass key, value to the formatters
      const reduced: Param = formatters.reduce(
        (previous: Param, formatter: Formatter) => {
          if (!formatter || typeof formatter.stringify !== 'function') {
            return previous;
          }
          return formatter.stringify(previous.key, previous.value || '');
        },
        ({ key: key, value: value }: Param),
      );

      const encodedKey: string = encode
        ? encodeString(reduced.key)
        : reduced.key;
      const encodedValue: string = encode
        ? encodeString(reduced.value || '')
        : reduced.value || '';

      const stringified: string = defaultFormatter.stringify(
        encodedKey,
        encodedValue,
      );

      return stringified;
    });

  // join params with and &
  const joinedParams: string = paramsArray.join('&');

  return joinedParams;
};
