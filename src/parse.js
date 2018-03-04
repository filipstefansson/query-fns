/* @flow */

type Param = {
  key: string,
  value: ?string,
};

type ParamsObject = {
  [string]: ?string | (?string)[],
};

// TODO: move this to its own file
const parseFormatter = (
  key: string,
  value: ?string,
  accumulator: ParamsObject,
): ?string | (?string)[] => {
  const decodedValue: ?string = value ? decodeURIComponent(value) : null;
  // if there's no previous value, just add it
  if (accumulator[key] === undefined) return (accumulator[key] = decodedValue);
  // if there's a previous value, add new value to that
  return [].concat(accumulator[key], decodedValue);
};

/**
 * Parse a query string.
 *
 * @param  {string} string A query string
 * @return {ParamsObject}        The query string params
 */
export default (query: string): ParamsObject => {
  // early exit
  if (!query || typeof query !== 'string') return (Object.create(null): any);

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
      return { key: decodeURIComponent(key), value };
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

      // pass key, value and current params object to the formatter
      // TODO: add more formatters and support for custom function
      newParamsObj[param.key] = parseFormatter(
        param.key,
        param.value,
        newParamsObj,
      );

      return newParamsObj;
    },
    (Object.create(null): any),
  );

  return reduced;
};
