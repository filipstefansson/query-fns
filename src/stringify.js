/* @flow */
import { stringify } from './formatters/default';
import extend from './utils/extend';

/**
 * Create a query string from an object
 *
 * @param  {Object} params Object with params
 * @return {string}        A query string
 */
export default (input: ?Object, opts: StringifyOptions): string => {
  if ((!input || typeof input !== 'object': boolean)) return ('': string);

  // create options
  const options: StringifyOptions = extend(
    {
      encode: true,
      formatter: null,
    },
    opts || {},
  );
  const { formatter }: StringifyOptions = options;

  // create new params object and accumulator
  const params: Object = extend({}, input);

  // go through params and create array of key=value strings
  const paramsArray: string[] = Object.keys(params)
    // remove items where value is empty
    .filter((key: string): boolean => {
      const value: Object = params[key];
      // remove bad strings
      if ((typeof value === 'string' && value.trim() === '': boolean))
        return (false: boolean);

      // include if array and not empty
      if ((Array.isArray(value) && value.length > 0: boolean))
        return (true: boolean);

      // include if object or string
      return (typeof value === 'object' || typeof value === 'string': boolean);
    })
    .map((key: string): string => {
      // use defaultFormatter or custom formatter on value and return the output
      const stringified: string = formatter
        ? (formatter.stringify(key, params[key], params, options): string)
        : (stringify(key, params[key], params, options): string);

      return (stringified: string);
    });

  // join params with and &
  const joinedParams: string = paramsArray
    .filter((val: string): boolean => !!val)
    .join('&');

  return (joinedParams: string);
};
