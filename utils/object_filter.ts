export function filterObject<T extends object>(
  object: T,
  excludeKeys: string[]
): T {
  const filteredObject = Object.fromEntries(
    Object.entries(object).filter(([key]) => !excludeKeys.includes(key))
  );
  return filteredObject as T;
}
