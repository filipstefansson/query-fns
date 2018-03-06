/* @flow */
const extend: Function = (obj: Object, src: Object): Object => {
  Object.keys(src).forEach((key: string) => {
    obj[key] = src[key];
  });
  return obj;
};

export default (extend: Function);
