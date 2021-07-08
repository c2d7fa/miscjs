type GetPath<O, P> = P extends ""
  ? O
  : P extends `${infer Left}.${infer Right}`
  ?
      | GetPath<NonNullable<GetPath<O, Left>>, Right>
      | (null extends GetPath<O, Left> ? null : never)
      | (undefined extends GetPath<O, Left> ? undefined : never)
  : P extends keyof O
  ? O[P]
  : never;

type SetPath<O, P> = P extends ""
  ? O
  : P extends `${infer Left}.${infer Right}`
  ? SetPath<NonNullable<SetPath<O, Left>>, Right>
  : P extends keyof O
  ? O[P]
  : never;

export function get<O, P extends string>(o: O, path: P): GetPath<O, P> {
  let result: any = o;
  for (const segment of path.split(".")) {
    if (segment === "") continue;
    if (result === null || result === undefined) continue;
    if (!(segment in result)) throw "invalid segment: " + segment;
    result = result[segment];
  }

  return result;
}

export function set<O, P extends string>(o: O, path: P, value: SetPath<O, P>): O {
  const [left, ...rest] = path.split(".");
  const right = rest.join(".");
  if (!left) return value as O;
  if (!(left in o)) throw "invalid path segment: " + left;
  if (!right) return {...o, [left]: value};
  return {...o, [left]: set(o[left as keyof O], right, value as any)};
}

export function update<O, P extends string>(o: O, path: P, f: (x: GetPath<O, P>) => SetPath<O, P>): O {
  return set(o, path, f(get(o, path)));
}
