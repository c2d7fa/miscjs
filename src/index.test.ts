/// <reference types="jest" />

import {implies} from "./index";

describe("implies", () => {
  it("false implies anything", () => {
    expect(implies(false, true)).toBeTruthy();
    expect(implies(false, false)).toBeTruthy();
  });

  it("true only implies true", () => {
    expect(implies(true, true)).toBeTruthy();
    expect(implies(true, false)).toBeFalsy();
  })
});
