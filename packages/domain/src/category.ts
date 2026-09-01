export type Category = Readonly<{
  id: string;
  key: string;
  displayName: string;
}>;

export function createCategory(input: { id: string; key: string; displayName: string }): Category {
  const id = input.id.trim();
  const key = input.key.trim();
  const displayName = input.displayName.trim();
  if (!id) throw new Error('Category id must not be empty');
  if (!key) throw new Error('Category key must not be empty');
  if (!displayName) throw new Error('Category displayName must not be empty');
  return { id, key, displayName };
}
