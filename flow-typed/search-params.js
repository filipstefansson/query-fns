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

declare type Formatters = Formatter[];

declare type StringifyOptions = {
  formatter: Formatter,
  encode: boolean,
};

declare type ParseOptions = {
  formatters: Formatters,
  decode: boolean,
};
