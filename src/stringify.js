/* @flow */

/**
 * Create a query string from an object
 *
 * @param  {Object} params Object with params
 * @return {string}        A query string
 */
export default (params: ?Object): string => {
  if (!params) return '';

  // create new params object
  const paramsObject: Object = Object.assign({}, params);

  // go through params and create array of key=value strings
  const paramsArray: string[] = Object.keys(paramsObject).map((key: string) => {
    return `${key}=${paramsObject[key]}`;
  });

  // join params with and &
  const joinedParams = paramsArray.join('&');

  return joinedParams;
};
