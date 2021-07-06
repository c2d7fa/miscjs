/// <reference types="@types/jest" />

import {isValid} from "./spec";

describe("basic types", () => {
  test("strings are strings", () => {
    expect(isValid("string", "this is a string")).toBeTruthy();
  });

  test("numbers are numbers", () => {
    expect(isValid("number", 0.5)).toBeTruthy();
  });

  test("null is null", () => {
    expect(isValid("null", null)).toBeTruthy();
  });

  test("undefined is undefined", () => {
    expect(isValid("undefined", undefined)).toBeTruthy();
  });

  test("booleans are booleans", () => {
    expect(isValid("boolean", true)).toBeTruthy();
  });

  test("dates are dates", () => {
    expect(isValid("date", new Date("2021-07-05T17:08:35Z"))).toBeTruthy();
  });
});
