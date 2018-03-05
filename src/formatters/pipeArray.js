/* @flow */
import encodeString from '../utils/encode';

const parse = (key: string, value: Value): Value => {
  // early exit
  if (!value || value === '') return value;
  // handle array by calling parse recursively
  if (Array.isArray(value)) {
    return value.map((nestedValue: Value): Value => parse(key, nestedValue));
  }

  // split the string in to an array of strings
  const parts: Value = value.split('|').map(val => val.trim());
  // if split was succesful, make sure the length of the array is more than
  // 1 otherwise return it a string instead of an array
  const newValue: Value =
    Array.isArray(parts) && parts.length > 1
      ? parts.filter((val: Value) => val && val !== '')
      : parts && parts[0];

  return newValue;
};

const stringify: StringifyFormatter = (
  key: string,
  value: Value,
  options: StringifyOptions,
): Param => {
  // if value is an array, we go through it and add | between the items
  if (Array.isArray(value)) {
    // encode values if encode option is true
    const newValue = (!options.encode
      ? value
      : value.map((val: Value) => {
          if (typeof val === 'string') {
            return encodeString(val.trim());
          }
        })
    ).filter((val: Value) => val && val !== ''); // filter out empty values
    // join array of items by |
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
