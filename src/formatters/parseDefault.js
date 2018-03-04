import { type ParamsObject } from '../parse';

export default (
  key: string,
  value: ?string,
  accumulator: ParamsObject,
): ?string | (?string)[] => {
  // if there's no previous value, just add it
  if (accumulator[key] === undefined) return (accumulator[key] = value);
  // if there's a previous value, add new value to that
  return [].concat(accumulator[key], value);
};
