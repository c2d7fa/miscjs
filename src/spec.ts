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

type JsonDate = `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`;

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
  | [typeof $_or, readonly Spec[]]
  | typeof $jsonDate;

export type Value<P> = P extends keyof BasicTypes
  ? BasicTypes[P]
  : P extends [typeof $_array, infer Q]
  ? Value<Q>[]
  : P extends [typeof $_literal, ...infer Ks]
  ? Ks extends string[]
    ? LiteralIn<Ks>
    : never
  : P extends typeof $jsonDate
  ? JsonDate
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

  return false;
}
