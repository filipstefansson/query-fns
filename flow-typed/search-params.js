declare type Value = ?string | (?Value)[] | { [string]: Value };

declare type Param = {
  key: string,
  value: Value,
};

declare type ParamsObject = {
  [string]: Value,
};

declare type StringifyFormatter = (string, Value, ?StringifyOptions) => string;
declare type ParseFormatter = (string, Value, ?ParseOptions) => Param;

declare type Formatter = { parse: Function, stringify: StringifyFormatter };

declare type StringifyOptions = {
  formatter: Formatter,
  encode: boolean,
};

declare type ParseOptions = {
  formatter: Formatter,
  decode: boolean,
};
