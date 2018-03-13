/* @flow */
import { stringify } from './formatters/default';
import extend from './utils/extend';

/**
 * Create a query string from an object
 *
 * @param  {Object} params Object with params
 * @return {string}        A query string
 */
export default (params: ?Object, opts: StringifyOptions): string => {
  if (!params || typeof params !== 'object') return '';

  // create options
  const options: StringifyOptions = extend(
    {
      formatters: [],
      encode: true,
    },
    opts || {},
  );
  const { formatter }: StringifyOptions = options;

  // create new params object
  const paramsObject: Object = extend({}, params);

  // go through params and create array of key=value strings
  const paramsArray: string[] = Object.keys(paramsObject)
    // remove items where value is empty
    .filter((key: string) => {
      const value: Value = paramsObject[key];
      // remove bad strings
      if (typeof value === 'string' && value.trim() === '') return false;

      // include if array and not empty
      if (Array.isArray(value) && value.length > 0) return true;

      // include if object or string
      return typeof value === 'object' || typeof value === 'string';
    })
    .map((key: string) => {
      const stringified: string = formatter
        ? formatter.stringify(key, paramsObject[key], options)
        : stringify(key, paramsObject[key], options);

      return stringified;
    });

  // join params with and &
  const joinedParams: string = paramsArray.filter(val => val).join('&');

  return joinedParams;
};
