/* @flow */
import encodeString from '../utils/encode';

const parse: ParseFormatter = (key: string, value: Value): Param => {
  // early exit
  // if (!value || value === '') return { key, value };
  // get key
  const parts: string[] = key.split(/\[(.+)/);
  let newKey: string = parts[0];

  // copy value
  let newValue: Value = value;

  // is there an object to parsed here? eg: foo[bar]
  if (parts.length > 1 && parts[1].endsWith(']') && typeof value === 'string') {
    newValue = {};
    const nestedKey: string = parts[1].slice(0, -1);
    newValue[nestedKey] = value.split(',');
  }

  // if there's no ending bracked, return original key
  if (parts.length > 1 && !parts[1].endsWith(']')) {
    newKey = key;
  }

  return { key: newKey, value: newValue };
};

const stringify: StringifyFormatter = (
  key: string,
  value: Value,
  options: ?StringifyOptions,
): Param => {
  return { key, value };
};

export default {
  parse,
  stringify,
};
