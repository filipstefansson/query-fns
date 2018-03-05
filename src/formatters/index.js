/* @flow */
import defaultFormatter from './default';
import pipeArrayFormatter from './pipeArray';
import { type Value } from '../parse';
export type StringifyFunction = (string, Value) => any;
export type Formatter = { parse: Function, stringify: StringifyFunction };
export type Formatters = Formatter[];

export { defaultFormatter, pipeArrayFormatter };
