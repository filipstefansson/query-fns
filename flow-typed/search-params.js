declare type Param = {
  key: string,
  value: Object | ?string | Array<mixed>,
};

declare type QueryParam = {
  key: string,
  value: ?string,
};

declare type StringifyFormatter = (
  string,
  Object | ?string,
  Object,
  StringifyOptions,
) => string;

declare type ParseFormatter = (string, ?string, Object, ParseOptions) => Param;

declare type Formatter = {
  parse: ParseFormatter,
  stringify: StringifyFormatter,
};

declare type StringifyOptions = {
  formatter: ?Formatter,
  encode: boolean,
};

declare type ParseOptions = {
  formatter: ?Formatter,
  decode: boolean,
};
