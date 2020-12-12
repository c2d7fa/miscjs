export default function choose<R>(
  choice: string,
  options: {[key: string]: () => R},
): {found: true; value: R} | {found: false; value: undefined} {
  const found = choice in options;

  if (found) {
    return {found, value: options[choice]()};
  } else {
    return {found, value: undefined};
  }
}
