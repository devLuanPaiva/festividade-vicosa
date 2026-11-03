export function distributePhotos<Item>(items: Item[], groupCount: number): Item[][] {
  const groups: Item[][] = Array.from({ length: groupCount }, () => []);
  items.forEach((item, index) => {
    groups[index % groupCount]?.push(item);
  });
  return groups;
}
