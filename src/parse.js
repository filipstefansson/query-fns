/* @flow */
import { parse } from './formatters/default';
import extend from './utils/extend';

/**
 * Parse a query string.
 *
 * @param  {string} string A query string
 * @return {Object}        The query string params
 */
export default (query: string, opts: ?ParseOptions): Object => {
  // early exit
  if (!query || typeof query !== 'string') return (Object.create(null): any);

  // create options
  const options: ParseOptions = extend(
    {
      formatters: [],
      decode: true,
    },
    opts || {},
  );
  const { formatter }: ParseOptions = options;

  // remove spaces and any ?&# in the beginning of the string
  const queryString: string = query.trim().replace(/^[?#&]/, '');

  // split query in to an array of { key: ..., value: ...} objects
  const params: QueryParam[] = queryString
    .split('&')
    .filter((param: string) => !!param)
    .map((param: string): QueryParam => {
      const parts: string[] = param.split('=');
      const key: string = parts.shift();
      const value: ?string = parts.length > 0 ? parts.join('=') : null;
      return ({ key, value }: QueryParam);
    });

  // reduce array in to an object we can return
  // Object.create(null) creates a new object without prototype
  const reduced: Object = params.reduce(
    (accumulator: Object, param: QueryParam) => {
      const { key, value } = param;

      // run default formatter if formatters array is empty
      const newParam: Param = formatter
        ? formatter.parse(key, value, accumulator, options)
        : parse(key, value, accumulator, options);

      // set new value
      accumulator[newParam.key] = newParam.value;
      return accumulator;
    },
    (Object.create(null): any),
  );

  return reduced;
};
