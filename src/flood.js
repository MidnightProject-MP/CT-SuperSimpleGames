function assertPositiveInteger(value, name) {
  if (!Number.isInteger(value) || value < 1) {
    throw new RangeError(`${name} must be a positive integer`);
  }
}

function validateShape(width, height, colorCount) {
  assertPositiveInteger(width, "width");
  assertPositiveInteger(height, "height");
  assertPositiveInteger(colorCount, "colorCount");
  if (colorCount > 256) throw new RangeError("colorCount must not exceed 256");
}

export function createBoard({ width, height, colorCount, cells }) {
  validateShape(width, height, colorCount);
  if (!cells || cells.length !== width * height) {
    throw new RangeError("cells length must equal width × height");
  }

  const values = Array.from(cells);
  for (const color of values) {
    if (!Number.isInteger(color) || color < 0 || color >= colorCount) {
      throw new RangeError("every cell must contain a valid color index");
    }
  }

  const copy = Uint8Array.from(values);
  return { width, height, colorCount, cells: copy };
}

export function createSeededRandom(seed) {
  let state = Number(seed) >>> 0;
  if (state === 0) state = 0x6d2b79f5;

  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
}

export function generateBoard({ width = 5, height = 5, colorCount = 4, seed = 1 } = {}) {
  validateShape(width, height, colorCount);
  const cellCount = width * height;
  if (colorCount > cellCount) {
    throw new RangeError("colorCount cannot exceed the number of cells");
  }

  const random = createSeededRandom(seed);
  const cells = new Uint8Array(cellCount);

  for (let index = 0; index < colorCount; index += 1) cells[index] = index;
  for (let index = colorCount; index < cellCount; index += 1) {
    cells[index] = Math.floor(random() * colorCount);
  }

  for (let index = cellCount - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [cells[index], cells[swapIndex]] = [cells[swapIndex], cells[index]];
  }

  return createBoard({ width, height, colorCount, cells });
}

export function floodRegion(board) {
  const { width, height, cells } = createBoard(board);
  const sourceColor = cells[0];
  const visited = new Uint8Array(cells.length);
  const queue = new Uint32Array(cells.length);
  const region = [];
  let head = 0;
  let tail = 1;
  queue[0] = 0;
  visited[0] = 1;

  while (head < tail) {
    const index = queue[head];
    head += 1;
    region.push(index);
    const x = index % width;
    const y = Math.floor(index / width);
    const neighbors = [];
    if (x > 0) neighbors.push(index - 1);
    if (x + 1 < width) neighbors.push(index + 1);
    if (y > 0) neighbors.push(index - width);
    if (y + 1 < height) neighbors.push(index + width);

    for (const neighbor of neighbors) {
      if (visited[neighbor] || cells[neighbor] !== sourceColor) continue;
      visited[neighbor] = 1;
      queue[tail] = neighbor;
      tail += 1;
    }
  }

  return region.sort((left, right) => left - right);
}

export function floodFill(board, nextColor) {
  const current = createBoard(board);
  if (!Number.isInteger(nextColor) || nextColor < 0 || nextColor >= current.colorCount) {
    throw new RangeError("nextColor must be a valid color index");
  }

  const oldColor = current.cells[0];
  if (nextColor === oldColor) {
    const captured = floodRegion(current);
    return {
      board: current,
      oldColor,
      newColor: nextColor,
      changed: [],
      captured,
      moved: false,
      solved: captured.length === current.cells.length
    };
  }

  const changed = floodRegion(current);
  const cells = Uint8Array.from(current.cells);
  for (const index of changed) cells[index] = nextColor;
  const nextBoard = createBoard({ ...current, cells });
  const captured = floodRegion(nextBoard);

  return {
    board: nextBoard,
    oldColor,
    newColor: nextColor,
    changed,
    captured,
    moved: true,
    solved: captured.length === cells.length
  };
}

export function resolveFloodChoice(board, selectedIndex) {
  const current = createBoard(board);
  if (!Number.isInteger(selectedIndex) || selectedIndex < 0 || selectedIndex >= current.cells.length) {
    throw new RangeError("selectedIndex must identify a board cell");
  }
  const priorCaptured = floodRegion(current);
  const selectedIdentity = current.cells[selectedIndex];
  const result = floodFill(current, selectedIdentity);
  return {
    ...result,
    selectedIndex,
    selectedIdentity,
    priorCaptured
  };
}

export function isSolved(board) {
  const current = createBoard(board);
  return current.cells.every((color) => color === current.cells[0]);
}
