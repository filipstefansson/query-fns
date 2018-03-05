/* @flow */
import { type ParamsObject, type Value } from '../parse';
import { type Formatter, type StringifyFunction } from '.';

const parse: Function = (
  key: string,
  value: string,
  accumulator: ParamsObject,
  initalValue: string,
): Value => {
  // if there's no previous value, just add it
  if (accumulator[key] === undefined) return initalValue;
  // if there's a previous value, add new value to that
  return [].concat(accumulator[key], initalValue);
};

const stringify: StringifyFunction = (key: string, value: Value): any => {
  return `${key}=${(value: any)}`;
};

export default ({
  parse,
  stringify,
}: Formatter);
