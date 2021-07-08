type AtPath<O, P> = P extends ""
  ? O
  : P extends `${infer Left}.${infer Right}`
  ? AtPath<AtPath<O, Left>, Right>
  : P extends keyof O
  ? O[P]
  : never;

export function get<O, P extends string>(o: O, path: P): AtPath<O, P> {
  let result: any = o;
  for (const segment of path.split(".")) {
    if (segment === "") continue;
    if (!(segment in result)) throw "invalid segment: " + segment;
    result = result[segment];
  }

  return result;
}
