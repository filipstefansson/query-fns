/* @flow */
import { stringify } from './formatters/default';
import encodeString from './utils/encode';

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
      const value: Value = paramsObject[key];
      // remove bad strings
      if (typeof value === 'string' && value.trim() === '') return false;

      // include if good
      return value && value.length > 0;
    })
    .map((key: string) => {
      const encodedKey: string = encode ? encodeString(key) : key;

      // pass key, value to the formatters
      const reduced: Param = formatters.reduce(
        (previous: Param, formatter: Formatter) => {
          if (!formatter || typeof formatter.stringify !== 'function') {
            return previous;
          }
          return formatter.stringify(previous.key, previous.value, options);
        },
        ({ key: encodedKey, value: paramsObject[key] }: Param),
      );

      // use defaultFormatter to create the key:value string
      const stringified: string = stringify(
        reduced.key,
        reduced.value,
        options,
      );

      return stringified;
    });

  // join params with and &
  const joinedParams: string = paramsArray.filter(val => val).join('&');

  return joinedParams;
};
