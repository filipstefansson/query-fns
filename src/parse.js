/* @flow */
import { defaultFormatter } from './formatters';

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
  const options: ParseOptions = Object.assign(
    {},
    {
      formatters: [],
      decode: true,
    },
    opts,
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
      const value: ?string = parts.length > 0 ? parts.join('=') : null;
      return { key, value };
    });

  // reduce array in to an object we can return
  // Object.create(null) creates a new object without prototype
  const reduced: ParamsObject = params.reduce(
    (paramsObj: ParamsObject, param: Param) => {
      // set initial value
      let key: string = decode ? decodeURIComponent(param.key) : param.key;
      let value: ?string = param.value ? decodeURIComponent(param.value) : null;

      // pass key, value and current params object to the formatters
      [defaultFormatter].concat(formatters).forEach((formatter: Formatter) => {
        if (!formatter || typeof formatter.parse !== 'function') return;
        const newValue: any = formatter.parse(
          key,
          paramsObj[key],
          paramsObj,
          decode ? value : param.value,
        );
        paramsObj[key] = newValue;
      });

      return paramsObj;
    },
    (Object.create(null): any),
  );

  return reduced;
};
