class Sorted {
  constructor(array, compare) {
    this.array = array.slice();
    this.compare = compare || ((a, b) => (a - b));
  }

  receive(position) {
    this.array.push(position);
  }

  // 给出一个最小值，如何比较由 compare 参数函数决定
  give() {
    if (!this.array.length) return;
    let minIdx = 0;
    let min = this.array[minIdx];

    this.array.forEach((cur, idx) => {
      if (this.compare(cur, min) < 0) {
        minIdx = idx;
        min = this.array[idx];
      }
    })
    this.array[minIdx] = this.array[this.array.length - 1];
    this.array.pop();

    return min;
  }

  sort() {
    return this.array.sort(this.compare);
  }

  includes(position) {
    const [xp, yp] = position;
    for (const item of this.array) {
      const [x, y] = item.position;
      if (x === xp && y === yp) return item;
    }
    return false;
  }
}

const distance = (posA, posB) => {
  const [xA, yA] = posA;
  const [xB, yB] = posB;

  // return 10 * (xA - xB) ** 2 + (yA - yB) ** 2;
  return 10 * +Math.sqrt((xA - xB) ** 2 + (yA - yB) ** 2).toFixed(1);
}

const sleep = timeout => new Promise((resolve, reject) => setTimeout(resolve, timeout));

const includes = (position, array) => {
  const [xp, yp] = position;
  for (const [x, y] of array) {
    if (x === xp && y === yp) return true;
  }
  return false;
}

const findPath = async (map, start, end) => {
  const table = Object.create(map);
  const openList = new Sorted(
    [{ position: start }],
    ((a, b) => (a.F - b.F))
  );
  const closeList = [];
  const mapContainer = document.getElementById('map');

  const insert = async (x, y, curG, previous) => {
    // 超出边界
    if (x < 0 || x > 99 || y < 0 || y > 99) return;
    // 不能走
    if (table[100 * x + y] === 1) return;
    if (includes([x, y], closeList)) return;
    // 走过了
    let ppp;
    if (ppp = openList.includes([x, y])) {
      const { G = 0 } = ppp;
      // 如果它已经在 open list 中，检查这条路径(即经由当前方格到达它那里) 是否更好，用 G 值作参考。更小的 G 值表示这是更好的路径。如果是这样，把它的 previous 重设为当前方格，并重新计算它的 G 和 F 值
      if (curG < G) {
        // 更新 G, F 值
        ppp.G = curG;
        ppp.F = ppp.F + (G - curG);

        table[100 * x + y] = previous;
      }
    } else {
      // 标记走过了，标记的值是上一个点，用来记录路径
      table[100 * x + y] = previous;
      await sleep(0);
      mapContainer.children[100 * x + y].setAttribute('style', `background-color: #4CAF50`);

      const H = distance([x, y], end);
      openList.receive({
        position: [x, y],
        H,
        G: curG,
        F: curG + H
      });
    }
  }

  while (openList.array.length) {
    const { position, G = 0 } = openList.give();
    let [x, y] = position;
    closeList.push([x, y]);
    // 当找到终点
    if (x === end[0] && y === end[1]) {
      let path = [];
      // 从终点开始，再往回找，直到起点
      while (x !== start[0] || y !== start[1]) {
        // 记录路径，从中取回该点坐标
        path.push(table[100 * x + y]);

        [x, y] = table[100 * x + y];
        mapContainer.children[100 * x + y].setAttribute('style', `background-color: #FF5722`);
        await sleep(50);
      }
      console.log(path.length)
      return path;
    }

    // ↑ → ↓ ← ↖ ↗ ↘ ↙ current position / previous position
    await insert(x - 1, y, G + 10, [x, y]);
    await insert(x, y + 1, G + 10, [x, y]);
    await insert(x + 1, y, G + 10, [x, y]);
    await insert(x, y - 1, G + 10, [x, y]);

    await insert(x - 1, y - 1, G + 14, [x, y]);
    await insert(x + 1, y - 1, G + 14, [x, y]);
    await insert(x + 1, y + 1, G + 14, [x, y]);
    await insert(x - 1, y + 1, G + 14, [x, y]);
  }
  return null;
}

// 一定在某一个点处，从该点改道的成本 + 改道目标地离终点的成本 < 不改道，

// give 时，给出 distance + 该点离当前点距离 二者之和最小的点，按该值排序，给最小，可保路径正确

// 为了保证修改后也能正确收集到路径，需要同时修改其 previous 记录