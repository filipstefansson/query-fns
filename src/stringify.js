/* @flow */

/**
 * Create a query string from an object
 *
 * @param  {Object} params Object with params
 * @return {string}        A query string
 */
export default (params: ?Object): string => {
  if (!params || typeof params !== 'object') return '';

  // create new params object
  const paramsObject: Object = Object.assign({}, params);

  // go through params and create array of key=value strings
  const paramsArray: string[] = Object.keys(paramsObject)
    // remove items where value is empty
    .filter((key: string) => {
      const value: string | (?string)[] = paramsObject[key];
      return value !== '' && value && value.length > 0;
    })
    .map((key: string) => {
      const value: string = paramsObject[key];
      return `${key}=${paramsObject[key]}`;
    });

  // join params with and &
  const joinedParams: string = paramsArray.join('&');

  return joinedParams;
};
