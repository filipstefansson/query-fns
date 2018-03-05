/* @flow */
import encodeString from '../utils/encode';

const parse: Function = (
  key: string,
  value: string,
  accumulator: ParamsObject,
): Value => {
  // if there's no previous value, just add it
  if (accumulator[key] === undefined) return value;
  // if there's a previous value, add new value to that
  return [].concat(accumulator[key], value);
};

const stringify: Function = (
  key: string,
  value: string,
  options: StringifyOptions,
): string => {
  // encode values if encode is true in options and if user formatters are 0
  // if user has a formatter, they are responsible for encoding themselves
  const newValue =
    options.encode && options.formatters.length === 0
      ? encodeString(value)
      : value;

  return `${key}=${newValue}`;
};

export default {
  parse,
  stringify,
};
