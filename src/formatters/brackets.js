/* @flow */
import encodeString from '../utils/encode';

const parse: ParseFormatter = (
  key: string,
  value: ?string,
  accumulator: Object,
  options: ParseOptions,
): Param => {
  let newKey: string = options.decode ? decodeURIComponent(key) : key;
  const newVal: ?string =
    options.decode && value ? decodeURIComponent(value) : value;

  // check for array
  if (key.endsWith('[]')) {
    newKey = key.replace(/\[\]$/, '');
  } else {
    // handle non arrays
    return ({ key: newKey, value: newVal }: Param);
  }

  // if there's no previous value, add it as an array
  if (accumulator[newKey] === undefined) {
    return ({ key: newKey, value: [newVal] }: Param);
  }

  // if there's a previous value, add new value to that
  return ({
    key: newKey,
    value: [].concat(accumulator[newKey], newVal),
  }: Param);
};

export const stringify: StringifyFormatter = (
  key: string,
  value: Object | ?string,
  source: Object,
  options: StringifyOptions,
): string => {
  if (Array.isArray(value)) {
    const newValue: string[] = value
      .map((val: Object) => {
        if (typeof val === 'string' && val.trim() !== '') {
          return ((options.encode
            ? `${encodeString(key)}[]=${encodeString(val.trim())}`
            : `${key}[]=${val.trim()}`): string);
        } else if (val !== undefined) {
          return `${key}[]`;
        }
      })
      .filter(
        (val: Object | ?string): boolean => val !== undefined && val !== '',
      ); // filter out empty values
    return (newValue.join('&'): string);
  }

  // handle string and encode values if encode is true
  if (typeof value === 'string') {
    const newValue: string = options.encode ? encodeString(value) : value;
    const newKey: string = options.encode ? encodeString(key) : key;
    return `${newKey}=${newValue}`;
  }

  return options.encode ? encodeString(key) : key;
};

export default { parse, stringify };
