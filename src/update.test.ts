/// <reference types="@types/jest" />

import {get, set, update} from "./update";

describe("getting a value", () => {
  test("at an empty path is just the value itself", () => {
    expect(get({a: 1}, "")).toEqual({a: 1});
  });

  test("at a path with one key is the value at that key", () => {
    expect(get({a: 1}, "a")).toEqual(1);
  });

  test("a path with multiple keys is the value at the end of the path", () => {
    expect(get({a: {b: {c: {d: 1, e: 2, f: 3}, g: 4}}}, "a.b.c.d")).toEqual(1);
  });

  test("when the path has a null, it returns null", () => {
    expect(get({a: null} as {a: {b: number} | null}, "a.b")).toEqual(null);
  });

  test("when the path has an undefined value, it returns undefined", () => {
    expect(get({a: undefined} as {a: {b: number} | undefined}, "a.b")).toEqual(null);
  });
});

describe("replacing a value", () => {
  test("at an empty path just returns the new value", () => {
    expect(set({a: 1}, "", {a: 3})).toEqual({a: 3});
  });

  test("at a path with one key replaces the value at that key", () => {
    expect(set({a: 1, b: 2, c: {d: 3}}, "a", -1)).toEqual({a: -1, b: 2, c: {d: 3}});
  });

  test("at a deeply nested key replaces the value at that key", () => {
    expect(set({a: {b: {c: 1, d: 2}, e: 3}, f: 4}, "a.b.c", -1)).toEqual({a: {b: {c: -1, d: 2}, e: 3}, f: 4});
  });
});
