/* @flow */
import encodeString from '../utils/encode';
import extend from '../utils/extend';

const parse: ParseFormatter = (
  key: string,
  value: ?string,
  accumulator: Object,
  options: ParseOptions,
): Param => {
  const { decode } = options;
  const parts: string[] = key.split(/\[(.+)/);
  let newKey: string = decode ? decodeURIComponent(parts[0]) : parts[0];

  // copy value
  let newValue: Object | ?string = value;

  // is there an object to parsed here? eg: foo[bar]
  if (parts.length > 1 && parts[1].endsWith(']')) {
    newValue = {};
    const nestedKey: string = parts[1].slice(0, -1);
    if (typeof value === 'string') {
      newValue[nestedKey] = value
        .split(',')
        .map((val: string) => (decode ? decodeURIComponent(val) : val));
    } else {
      // handle empty value
      newValue[nestedKey] = null;
    }
  } else {
    // if key is a plain string(no nested object), value will be a string
    newValue =
      decode && typeof newValue === 'string'
        ? decodeURIComponent(newValue)
        : newValue;
  }

  // if there's no ending bracked, return original key
  if (parts.length > 1 && !parts[1].endsWith(']')) {
    newKey = key;
  }

  // if there's an previous value, extend that value with the new value
  if (accumulator[newKey] && typeof accumulator[newKey] === 'object') {
    newValue = extend(accumulator[newKey], newValue);
  }

  return { key: newKey, value: newValue };
};

const stringify: StringifyFormatter = (
  key: string,
  value: Object | ?string,
  source: Object,
  options: StringifyOptions,
): string => {
  const newKey = options.encode ? encodeString(key) : key;
  if (Array.isArray(value)) {
    // handle array
    return `${newKey}=${value.join(',')}`;
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
        ? valueObject[nestedKey]
            .map((val: string) => (options.encode ? encodeString(val) : val))
            .join(',')
        : options.encode ? encodeString(nestedValue) : nestedValue;

      return `${newKey}[${nestedKey}]=${nestedValue}`;
    });

    return newParam.join('&');
  }
  // handle string
  if (typeof value === 'string') {
    const newValue = options.encode ? encodeString(value) : value;
    return `${newKey}=${newValue}`;
  }
  // if there is no value
  return newKey;
};

export default {
  parse,
  stringify,
};
