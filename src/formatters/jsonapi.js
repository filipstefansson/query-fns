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
): string => {
  if (Array.isArray(value)) {
    // handle array
    return `${key}=${value.join(',')}`;
  } else if (value && typeof value === 'object') {
    // handle object
    const newParam: string[] = Object.keys(value).map((nestedKey: string) => {
      // tell flow that this is an object
      // TODO: figure out why flow thinks value is an array here
      const valueObject: Object = (value: any);
      // extranct the nested value. Will be an array of string or a string
      let nestedValue: string | string[] = valueObject[nestedKey];
      // if it's a string, join it by ,
      nestedValue = Array.isArray(nestedValue)
        ? valueObject[nestedKey].join(',')
        : nestedValue;

      return `${key}[${nestedKey}]=${nestedValue}`;
    });

    return newParam.join('&');
  }
  // handle string
  if (typeof value === 'string') {
    return `${key}=${value}`;
  }
  // worst case :(
  return key;
};

export default {
  parse,
  stringify,
};
