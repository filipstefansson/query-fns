/* @flow */
import { parse } from './formatters/default';
import extend from './utils/extend';

/**
 * Parse a query string.
 *
 * @param  {string} string A query string
 * @return {ParamsObject}        The query string params
 */
export default (query: string, opts: ParseOptions): ParamsObject => {
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
  const { formatters, decode }: ParseOptions = options;

  // remove spaces and any ?&# in the beginning of the string
  const queryString: string = query.trim().replace(/^[?#&]/, '');

  // split query in to an array of { key: ..., value: ...} objects
  const params: Param[] = queryString
    .split('&')
    .filter(param => !!param)
    .map((param: string): Param => {
      const parts: string[] = param.split('=');
      const key: string = parts.shift();
      const value: Value = parts.length > 0 ? parts.join('=') : null;
      return { key, value };
    });

  // create a new object that formatters can edit
  const newParams: ParamsObject = {};

  // reduce array in to an object we can return
  // Object.create(null) creates a new object without prototype
  const reduced: ParamsObject = params.reduce(
    (source: ParamsObject, param: Param) => {
      // set initial value
      const key: string = decode ? decodeURIComponent(param.key) : param.key;
      const value: Value =
        typeof param.value === 'string'
          ? decodeURIComponent(param.value)
          : null;

      // run default formatter if formatters array is empty
      if (formatters.length === 0) {
        const defaultParam = parse(key, decode ? value : param.value, source);
        source[defaultParam.key] = defaultParam.value;
      }

      // pass key, value and current params object to the formatters
      formatters.forEach((formatter: Formatter) => {
        if (!formatter || typeof formatter.parse !== 'function') return;
        const newParam: Param = formatter.parse(key, value, newParams);
        newParams[newParam.key] = newParam.value;
      });

      // if we have 0 formatters, return source instead.
      return formatters.length > 0 ? newParams : source;
    },
    (Object.create(null): any),
  );

  return reduced;
};
