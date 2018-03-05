/* @flow */
import encodeString from '../utils/encode';

const parse = (key: string, value: Value): Value => {
  // early exit
  if (!value || value === '') return value;
  // handle array by calling parse recursively
  if (Array.isArray(value)) {
    return value.map((nestedValue: Value): Value => parse(key, nestedValue));
  }

  // handle single values by splitting them by |
  if (typeof value === 'string') {
    // split the string in to an array of strings
    const parts: Value = value.split('|').map(val => val.trim());
    if (Array.isArray(parts)) {
      // if split was succesful, make sure the length of the array is more than
      // 1 otherwise return it a string instead of an array
      const newValue: Value =
        parts.length > 1
          ? parts.filter((val: Value) => val && val !== '')
          : parts[0];
      return newValue;
    }
    return value;
  }
};

const stringify: StringifyFormatter = (
  key: string,
  value: Value,
  options: StringifyOptions,
): Param => {
  if (Array.isArray(value)) {
    const newValue = (!options.encode
      ? value
      : value.map((val: Value) => {
          if (typeof val === 'string') {
            return encodeString(val.trim());
          }
        })
    ).filter((val: Value) => val && val !== '');
    return {
      key,
      value: newValue.join('|'),
    };
  }
  return { key, value };
};

export default {
  parse,
  stringify,
};
