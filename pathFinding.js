const sleep = timeout => new Promise((resolve, reject) => setTimeout(resolve, timeout));

const findPath = async (map, start, end) => {
  // 寻路算法，这个集合是关键。广度优先搜索是用队列(push shift)，深度优先搜索是用栈(push pop)。
  // 思路：
  // 集合初始元素是起点本身。之后，把能走到的点都放进来。
  // 放进来的点，也成为新的起点，所以再取出计算能走到的点，并放进来。
  // 直到找到终点，或集合为空。
  const queue = [start];
  const mapContainer = document.getElementById('map');

  const insert = async (x, y, previous) => {
    // 超出边界
    if (x < 0 || x > 99 || y < 0 || y > 99) return;
    // 不能走 或 走过了
    if (map[100 * x + y]) return;
    // 标记走过了，标记的值是上一个点，用来记录路径
    map[100 * x + y] = previous;
    await sleep(0);
    mapContainer.children[100 * x + y].setAttribute('style', `background-color: #4CAF50`);
    queue.push([x, y]);
  }

  while (queue.length) {
    let [x, y] = queue.shift(); // BFS
    // const [x, y] = queue.pop(); // DFS
    // 当找到终点
    if (x === end[0] && y === end[1]) {
      let path = [];
      // 从终点开始，再往回找，直到起点
      while (x !== start[0] || y !== start[1]) {
        // 记录路径，从中取回该点坐标
        path.push(map[100 * x + y]);
        // console.log(map[100 * x + y])
        // await sleep(0); // https://stackoverflow.com/questions/11214430/wrong-value-in-console-log 
        [x, y] = map[100 * x + y];
        mapContainer.children[100 * x + y].setAttribute('style', `background-color: #FF5722`);
        await sleep(50);
      }

      return path;
    }

    // ↑ → ↓ ← ↖ ↗ ↘ ↙ current position / previous position
    await insert(x - 1, y, [x, y]);
    await insert(x, y + 1, [x, y]);
    await insert(x + 1, y, [x, y]);
    await insert(x, y - 1, [x, y]);

    await insert(x - 1, y - 1, [x, y]);
    await insert(x + 1, y - 1, [x, y]);
    await insert(x + 1, y + 1, [x, y]);
    await insert(x - 1, y + 1, [x, y]);
  }
  return null;
}
