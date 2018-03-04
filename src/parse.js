/* @flow */
import { parseDefault } from './formatters';

export type Param = {
  key: string,
  value: ?string,
};

export type ParamsObject = {
  [string]: ?string | (?string)[],
};

export type Formatters = Function[];

type ParseOptions = {
  formatters: Formatters,
};

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
  const options = Object.assign({}, { formatters: [] }, opts);

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
      // copy previous params object
      const newParamsObj: ParamsObject = Object.assign(
        (Object.create(null): any),
        paramsObj,
      );

      // pass key, value and current params object to the formatters
      [parseDefault]
        .concat(options.formatters)
        .forEach((formatter: Function) => {
          if (typeof formatter !== 'function') return;
          const decodedKey: string = decodeURIComponent(param.key);
          const decodedValue: ?string = param.value ? param.value : null;
          newParamsObj[decodedKey] = formatter(
            decodeURIComponent(decodedKey),
            param.value ? decodeURIComponent(param.value) : null,
            newParamsObj,
          );
        });

      return newParamsObj;
    },
    (Object.create(null): any),
  );

  return reduced;
};
