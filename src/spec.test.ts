/// <reference types="@types/jest" />

import {$literal, $nullable, isValid} from "./spec";

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

describe("literals", () => {
  test("if a string is one of the given literals, it's valid", () => {
    expect(isValid($literal(["valid1", "valid2"]), "valid1")).toBeTruthy();
  });

  test("if a string is not one of the given literals, it's invalid", () => {
    expect(isValid($literal(["valid1", "valid2"]), "invalid")).toBeFalsy();
  });

  test("a non-string is never a valid literal, even if it would convert to the string representation", () => {
    expect(isValid($literal(["1"]), 1)).toBeFalsy();
  });
});

describe("nullable", () => {
  test("null is a valid nullable type", () => {
    expect(isValid($nullable("number"), null)).toBeTruthy();
  });

  test("a non-null value is invalid when the inner spec doesn't match", () => {
    expect(isValid($nullable("number"), "this is a string")).toBeFalsy();
  });

  test("a non-null value is valid when the inner spec matches", () => {
    expect(isValid($nullable("number"), 0.5)).toBeTruthy();
  });
});
