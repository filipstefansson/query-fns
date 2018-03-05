/* @flow */

const parse = (key: string, value: Value): Value => {
  // early exit
  if (!value || value === '') return value;
  const isArray = Array.isArray(value);
  if (isArray) {
    return (value: any).map((nestedValue: Value): Value =>
      parse(key, nestedValue),
    );
  }
  const parts: (?string)[] = (value: any).split('|');
  const newValue: Value =
    parts.length > 1
      ? parts.filter((val: Value) => val && val !== '')
      : parts[0];
  return newValue;
};

const stringify: StringifyFunction = (key: string, value: Value): any => {
  const isArray = Array.isArray(value);
  if (isArray) {
    return { key, value: (value: any).join('|') };
  }
  if (!value || value === '') return value;
  return { key, value: value };
};

export default {
  parse,
  stringify,
};
