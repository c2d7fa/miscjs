export type Rest<Xs extends any[]> = Xs extends [any, ...infer Ys] ? Ys : never;

type LiteralIn<Ks extends string[]> = Ks[number];

type BasicTypes = {
  string: string;
  number: number;
  boolean: boolean;
  null: null;
  undefined: undefined;
  date: Date;
};

const $_array = Symbol("arrayOf");
export const $array = <P extends Spec>(spec: P): [typeof $_array, P] => [$_array, spec];

const $_nullable = Symbol("nullable");
export const $nullable = <P extends Spec>(spec: P): [typeof $_nullable, P] => [$_nullable, spec];

export const $jsonDate = Symbol("jsonDate");

const $_literal = Symbol("literal");
export const $literal = <Ks extends readonly string[]>(options: Ks): [typeof $_literal, ...Ks] => [
  $_literal,
  ...options,
];

const $_check = Symbol("check");
export const $check = <T>(f: (x: unknown) => x is T): [typeof $_check, (x: unknown) => x is T] => [$_check, f];

const $_or = Symbol("or");
export const $or = <Ps extends readonly Spec[]>(specs: Ps): [typeof $_or, Ps] => [$_or, specs];

export type Spec =
  | keyof BasicTypes
  | {[key: string]: Spec}
  | [typeof $_array, Spec]
  | [typeof $_nullable, Spec]
  | [typeof $_literal, ...string[]]
  | [typeof $_check, (x: unknown) => boolean]
  | [typeof $_or, readonly Spec[]];

export type Value<P> = P extends keyof BasicTypes
  ? BasicTypes[P]
  : P extends [typeof $_array, infer Q]
  ? Value<Q>[]
  : P extends [typeof $_literal, ...infer Ks]
  ? Ks extends string[]
    ? LiteralIn<Ks>
    : never
  : P extends [typeof $_nullable, infer Q]
  ? Value<Q> | null
  : P extends Record<infer K, Spec>
  ? {[L in K]: Value<P[L]>}
  : P extends [typeof $_check, (x: unknown) => x is infer T]
  ? T
  : P extends [typeof $_or, infer Qs]
  ? Qs extends readonly []
    ? never
    : Qs extends readonly [infer R]
    ? Value<R>
    : Qs extends readonly [infer R, ...infer Rs]
    ? Value<R> | Value<[typeof $_or, Rs]>
    : never
  : never;

export function isValid<P extends Spec>(spec: P, value: unknown): value is Value<P> {
  if (spec === "string") return typeof value === "string";
  if (spec === "number") return typeof value === "number";
  if (spec === "boolean") return typeof value === "boolean";
  if (spec === "null") return value === null;
  if (spec === "undefined") return value === undefined;
  if (spec === "date") return value instanceof Date;

  if (spec instanceof Array && spec[0] === $_literal) {
    const validLiterals = spec.slice(1);
    if (typeof value !== "string") return false;
    return validLiterals.includes(value);
  }

  if (spec instanceof Array && spec[0] === $_nullable) {
    if (value === null) return true;
    return isValid(spec[1], value);
  }

  if (spec instanceof Array && spec[0] === $_array) {
    if (!(value instanceof Array)) return false;
    for (const subvalue of value) {
      if (!isValid(spec, subvalue)) return false;
    }
    return true;
  }

  if (spec instanceof Array && spec[0] === $_check) {
    return spec[1](value);
  }

  if (spec instanceof Array && spec[0] === $_or) {
    for (const subspec of spec[1]) {
      if (isValid(subspec, value)) return true;
    }
    return false;
  }

  if (typeof spec === "object") {
    if (typeof value !== "object") return false;
    if (value === null) return false;
    for (const key in spec) {
      if (!(key in value)) return false;
      // [TODO] Why don't types check below?
      if (!isValid(spec[key] as unknown as Spec, (value as any)[key])) return false;
    }
    return true;
  }

  return false;
}
