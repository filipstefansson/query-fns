declare type Param = {
  key: string,
  value: ?string,
};

declare type Value = ?string | (?string)[];

declare type ParamsObject = {
  [string]: Value,
};

declare type StringifyFunction = (string, Value) => any;

declare type Formatter = { parse: Function, stringify: StringifyFunction };

declare type Formatters = Formatter[];

declare type StringifyOptions = {
  formatters: Formatters,
  encode: boolean,
};

declare type ParseOptions = {
  formatters: Formatters,
  decode: boolean,
};
