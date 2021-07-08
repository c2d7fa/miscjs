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
  : P extends `${infer Left}[${infer Right}]`
  ? NonNullable<SetPath<O, Left>> extends Array<infer T>
    ? SetPath<NonNullable<T>, Right>
    : never
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
  if (path === "") return value as O;

  const dotMatch = path.match(/([^[.]*)\.(.*)/);
  if (dotMatch) {
    const key = dotMatch[1];
    if (!(key in o)) throw "invalid path segment: " + key;
    return {...o, [key]: set(o[key as keyof O], dotMatch[2], value as any)};
  }

  const arrayMatch = path.match(/([^[.]*)\[(.*)\]/);
  if (arrayMatch) {
    const key = arrayMatch[1];
    if (key !== "") {
      if (!(key in o)) throw "invalid path segment: " + key;
      return {...o, [key]: (o as any)[key as keyof O].map((x: any) => set(x, arrayMatch[2], value))};
    } else {
      return (o as any).map((x: any) => set(x, arrayMatch[2], value));
    }
  }

  return set(o, path + ".", value as any);
}

export function update<O, P extends string>(o: O, path: P, f: (x: GetPath<O, P>) => SetPath<O, P>): O {
  return set(o, path, f(get(o, path)));
}
