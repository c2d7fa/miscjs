export function arrayEq<T>(a: T[], b: T[], eq?: (x: T, y: T) => boolean): boolean {
  const eq_ = eq ?? ((x, y) => x === y);
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (!eq_(a[i], b[i])) return false;
  return true;
}

// A variant of splice that returns a new array rather than modifying its input.
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

export function includesBy<T>(a: T[], x: T, eq?: (x: T, y: T) => boolean): boolean {
  const eq_ = eq ?? ((x, y) => x === y);
  for (const y of a) if (eq_(x, y)) return true;
  return false;
}

export function indexOfBy<T>(a: T[], x: T, eq?: (x: T, y: T) => boolean): number | undefined {
  const eq_ = eq ?? ((x, y) => x === y);
  for (let i = 0; i < a.length; ++i) if (eq_(a[i], x)) return i;
  return undefined;
}

export function removeKey<V>(o: {[x: string]: V}, k: string): {[x: string]: V} {
  const result = {...o};
  delete result[k];
  return result;
}

export function removeKeyNumeric<V>(o: {[x: number]: V}, k: number): {[x: string]: V} {
  const result = {...o};
  delete result[k];
  return result;
}

export function removeBy<T>(a: T[], x: T, eq?: (x: T, y: T) => boolean): T[] {
  const eq_ = eq ?? ((x, y) => x === y);
  return a.filter((y) => !eq_(x, y));
}

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
