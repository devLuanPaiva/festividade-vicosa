export function requireAt<T>(items: readonly T[], index: number): T {
  const item = items[index];
  if (item === undefined) {
    throw new Error(`Posição ${index} inexistente em uma lista de ${items.length} itens.`);
  }
  return item;
}
