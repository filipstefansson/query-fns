/* @flow */
// https://github.com/kevva/strict-uri-encode/blob/master/index.js
export default (value: string): string =>
  encodeURIComponent(value).replace(
    /[!'()*]/g,
    (match: string) =>
      `%${match
        .charCodeAt(0)
        .toString(16)
        .toUpperCase()}`,
  );
