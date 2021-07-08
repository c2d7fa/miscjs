/// <reference types="@types/jest" />

import {get} from "./update";

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
});
