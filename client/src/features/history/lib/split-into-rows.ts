interface Sized {
  width: number;
  height: number;
}

interface CutRequest {
  row: number;
  end: number;
  ideal: number;
}

interface Cut {
  cost: number;
  from: number;
}

function rowCost(rowRatio: number, ideal: number): number {
  const deviation = rowRatio - ideal;
  return deviation * deviation;
}

function bestCut(prefix: number[], previous: number[], { row, end, ideal }: CutRequest): Cut {
  let best: Cut = { cost: Infinity, from: row - 1 };
  for (let from = row - 1; from < end; from++) {
    const rowRatio = (prefix[end] ?? 0) - (prefix[from] ?? 0);
    const cost = (previous[from] ?? Infinity) + rowCost(rowRatio, ideal);
    if (cost < best.cost) {
      best = { cost, from };
    }
  }
  return best;
}

function findCuts(prefix: number[], rowCount: number, ideal: number): number[][] {
  let previous = prefix.map((_, end) => (end === 0 ? 0 : Infinity));
  const cuts: number[][] = [];
  for (let row = 1; row <= rowCount; row++) {
    const current = prefix.map(() => Infinity);
    const rowCuts = prefix.map(() => 0);
    for (let end = row; end < prefix.length; end++) {
      const best = bestCut(prefix, previous, { row, end, ideal });
      current[end] = best.cost;
      rowCuts[end] = best.from;
    }
    cuts.push(rowCuts);
    previous = current;
  }
  return cuts;
}

function sliceByCuts<Item>(items: Item[], cuts: number[][]): Item[][] {
  const rows: Item[][] = [];
  let end = items.length;
  for (let row = cuts.length; row >= 1; row--) {
    const from = cuts[row - 1]?.[end] ?? 0;
    rows.unshift(items.slice(from, end));
    end = from;
  }
  return rows;
}

export function splitIntoRows<Item extends Sized>(items: Item[], rowCount: number): Item[][] {
  if (items.length === 0) {
    return [];
  }
  const count = Math.min(Math.max(rowCount, 1), items.length);
  const prefix = [0];
  items.forEach((item) => prefix.push((prefix.at(-1) ?? 0) + item.width / item.height));
  const ideal = (prefix.at(-1) ?? 0) / count;
  return sliceByCuts(items, findCuts(prefix, count, ideal));
}
