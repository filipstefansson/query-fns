/* @flow */
import encodeString from '../utils/encode';

export const parse: Function = (
  key: string,
  value: string,
  accumulator: ParamsObject,
): Value => {
  // if there's no previous value, just add it
  if (accumulator[key] === undefined) return value;
  // if there's a previous value, add new value to that
  return [].concat(accumulator[key], value);
};

export const stringify: Function = (
  key: string,
  value: Value,
  options: StringifyOptions,
): ?string => {
  if (Array.isArray(value)) {
    const newValue = value
      .map((val: Value) => {
        if (typeof val === 'string' && val.trim() !== '') {
          return options.encode
            ? `${key}=${encodeString(val.trim())}`
            : `${key}=${val.trim()}`;
        }
      })
      .filter((val: Value) => val && val !== ''); // filter out empty values
    return newValue.join('&');
  }

  // encode values if encode is true in options and if user formatters are 0
  // if user has a formatter, they are responsible for encoding themselves
  if (typeof value === 'string') {
    const newValue: string =
      options.encode && options.formatters.length === 0
        ? encodeString(value)
        : value;
    return `${key}=${newValue}`;
  }

  return null;
};
