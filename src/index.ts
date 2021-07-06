export {default as choose} from "./choose";
export * as spec from "./spec";

// Returns `true` if the two arrays are equal, in the sense that they contain
// the same elements at the same positions. If `eq` is given, it is used to
// compare the elements, otherwise `===` is used.
export function arrayEq<T>(a: T[], b: T[], eq?: (x: T, y: T) => boolean): boolean {
  const eq_ = eq ?? ((x, y) => x === y);
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (!eq_(a[i], b[i])) return false;
  return true;
}

// A variant of the built-in function `splice` that returns a new array rather
// than modifying its input.
export function splice<T>(a: T[], start: number, deleteCount?: number): T[];
export function splice<T>(a: T[], start: number, deleteCount: number, ...items: T[]): T[];
export function splice<T>(a: T[], start: number, deleteCount?: number, ...items: T[]): T[] {
  const result = [...a];
  if (deleteCount !== undefined) {
    result.splice(start, deleteCount, ...items);
  } else {
    result.splice(start);
  }
  return result;
}

// Returns `true` if `a` has the element `x`, `false` otherwise. If `eq` is
// given, it is used as the equality operator; otherwise, this is equivalent to
// `a.includes(x)`.
export function includesBy<T>(a: T[], x: T, eq?: (x: T, y: T) => boolean): boolean {
  const eq_ = eq ?? ((x, y) => x === y);
  for (const y of a) if (eq_(x, y)) return true;
  return false;
}

// Returns the first item in `a` equal to `x`. If `eq` is given, it is used as
// the equality operator.
export function indexOfBy<T>(a: T[], x: T, eq?: (x: T, y: T) => boolean): number | undefined {
  const eq_ = eq ?? ((x, y) => x === y);
  for (let i = 0; i < a.length; ++i) if (eq_(a[i], x)) return i;
  return undefined;
}

// Returns an identical object, but with the key `k` removed.
export function removeKey<V>(o: {[x: string]: V}, k: string): {[x: string]: V} {
  const result = {...o};
  delete result[k];
  return result;
}

// Like `removeKey`, but takes a number as the key.
export function removeKeyNumeric<V>(o: {[x: number]: V}, k: number): {[x: string]: V} {
  const result = {...o};
  delete result[k];
  return result;
}

// Remove the elements of `a` that are equal to `x`. When `eq` is given, use
// this operator for equality.
export function removeBy<T>(a: T[], x: T, eq?: (x: T, y: T) => boolean): T[] {
  const eq_ = eq ?? ((x, y) => x === y);
  return a.filter((y) => !eq_(x, y));
}

// Returns the items of `a` that are not also in `a`.
export function setMinus<T>(a: T[], b: T[]): T[] {
  let result = [...a];
  for (const y of b) {
    result = removeBy(result, y);
  }
  return result;
}

// Takes a mapping of class names to booleans denoting whether each class is
// enabled. Returns a string that can be used for the `class` attribute of an
// element.
export function classes(enabled: {[className: string]: boolean}): string {
  let enabledClasses = [];
  for (const className in enabled) {
    if (enabled[className]) enabledClasses.push(className);
  }
  return unwords(enabledClasses);
}

// Returns a string containing the given words separated by spaces.
export function unwords(words: string[]): string {
  let result = "";
  for (const word of words) {
    if (result == "") result = word;
    else result += " " + word;
  }
  return result;
}

// Returns `true` of `b` implies `c` (in the sense of a material conditional),
// `false` otherwise.
export function implies(b: boolean, c: boolean) {
  return !b || (b && c);
}

// Capitalizes the first character of the string.
export function capitalize(s: string) {
  return s.substr(0, 1).toUpperCase() + s.substr(1);
}

// Returns `text` truncated to the length `maxLength`. If the string is too
// large, three dots are inserted at the end such that the total length of the
// string is at most `maxLength`.
export function truncateEllipsis(text: string, maxLength: number) {
  if (text.length >= maxLength) {
    return text.substr(0, maxLength - 3) + "...";
  } else {
    return text;
  }
}
