/// <reference types="jest" />

import choose from "./choose";

describe("choose", () => {
  describe("a valid option", () => {
    const result = choose("valid", {
      valid() {
        return 1;
      },
    });

    it("is found", () => {
      expect(result.found).toBe(true);
    });

    it("is evaluated for its value", () => {
      expect(result.value).toBe(1);
    });
  });

  describe("an invalid option", () => {
    const result = choose("invalid", {
      valid() {
        return 1;
      },
    });

    it("isn't found", () => {
      expect(result.found).toBe(false);
    });

    it("has no value", () => {
      expect(result.value).toBeUndefined();
    });
  });

  describe("an option", () => {
    it("is evaluated only if chosen", () => {
      let evaluated = 0;

      const result = choose("invalid", {
        valid() {
          evaluated++;
        },
      });

      expect(result.found).toBe(false);
      expect(evaluated).toBe(0);
    });

    it("is evaluated exactly once if chosen", () => {
      let evaluated = 0;

      const result = choose("valid", {
        valid() {
          evaluated++;
        },
      });

      expect(result.found).toBe(true);
      expect(evaluated).toBe(1);
    });
  });
});
