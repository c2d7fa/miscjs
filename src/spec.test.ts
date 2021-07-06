/// <reference types="@types/jest" />

import {$array, $check, $literal, $nullable, $or, isValid} from "./spec";

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

describe("objects", () => {
  test("an empty object type matches any object", () => {
    expect(isValid({}, {a: 0.5})).toBeTruthy();
  });

  test("no non-objects are valid objects", () => {
    expect(isValid({}, 0.5)).toBeFalsy();
  });

  test("null is not a valid object", () => {
    expect(isValid({}, null)).toBeFalsy();
  });

  test("if an object is missing keys, it's invalid", () => {
    expect(isValid({a: "number", b: "string"}, {a: 0.5})).toBeFalsy();
  });

  test("if a key doesn't match the type, the object is invalid", () => {
    expect(isValid({a: "number", b: "string"}, {a: 0.5, b: -0.5})).toBeFalsy();
  });
});

describe("arrays", () => {
  test("an empty array is always a valid array", () => {
    expect(isValid($array("number"), [])).toBeTruthy();
  });

  test("a non-array is never a valid array", () => {
    expect(isValid($array("number"), "[]")).toBeFalsy();
    expect(isValid($array("number"), null)).toBeFalsy();
    expect(isValid($array("number"), {})).toBeFalsy();
    expect(isValid($array("number"), 0.5)).toBeFalsy();
  });

  test("if any array element doesn't match, the array is invalid", () => {
    expect(isValid($array("number"), [0, 1, "2", 3])).toBeFalsy();
  });

  test("if all array elements match, the array is valid", () => {
    expect(isValid($array("number"), [0, 1, 2, 3])).toBeTruthy();
  });
});

describe("custom checks", () => {
  test("if the check fails, the value is invalid", () => {
    function isLongString(x: unknown): x is string {
      return isValid("string", x) && x.length > 3;
    }
    expect(isValid($check(isLongString), "ab")).toBeFalsy();
  });

  test("if the check succeeds, the value is valid", () => {
    function isLongString(x: unknown): x is string {
      return isValid("string", x) && x.length > 3;
    }
    expect(isValid($check(isLongString), "abcd")).toBeTruthy();
  });
});

describe("or", () => {
  test("with no arguments, a value is always invalid", () => {
    expect(isValid($or([]), 0.5)).toBeFalsy();
  });

  test("with one argument, a value is valid if it matches the inner type", () => {
    expect(isValid($or(["number"]), 0.5)).toBeTruthy();
  });

  test("with one argument, a value is invalid if it doesn't match the inner type", () => {
    expect(isValid($or(["string"]), 0.5)).toBeFalsy();
  });

  test("with many arguments, a value is valid if it matches any one", () => {
    expect(
      isValid($or(["number", {value: "boolean"}, {value: "string"}]), {
        value: true,
      }),
    ).toBeTruthy();
  });

  test("with many arguments, a value is invalid if it matches none", () => {
    expect(
      isValid($or(["number", {value: "boolean"}, {value: "string"}]), {
        value: 0.5,
      }),
    ).toBeFalsy();
  });
});
