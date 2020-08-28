// better version
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
}

// class Sorted {
//   constructor(array, end) {
//     this.array = array.slice();
//     this.end = end;
//   }

//   receive(position) {
//     this.array.push(position);
//   }
//   // 每次给出一个离终点最近的点
//   give() {
//     if (!this.array.length) return;
//     // 找出最小值
//     let minIdx;
//     let shortestDistance = Infinity;
//     this.array.forEach((cur, idx) => {
//       const distanceToEnd = distance(cur, this.end);
//       if (distanceToEnd < shortestDistance) {
//         minIdx = idx;
//         shortestDistance = distanceToEnd;
//       }
//     });
//     const closest = this.array[minIdx];
//     // 取出最小值。splice 是 O(n) 的方法， 因为数组元素会整体挪动以填补空位。
//     // 这里 O(1) 的操作：保存最小值、用尾部元素覆盖最小值的位置、pop。
//     this.array[minIdx] = this.array[this.array.length - 1];
//     this.array.pop();
//     return closest;
//   }
// }

const distance = (posA, posB) => {
  const [xA, yA] = posA;
  const [xB, yB] = posB;
  return (xA - xB) ** 2 + (yA - yB) ** 2;
}

const sleep = timeout => new Promise((resolve, reject) => setTimeout(resolve, timeout));

const findPath = async (map, start, end) => {
  const table = Object.create(map);
  // 寻路算法，这个集合是关键。广度优先搜索是用队列(push shift)，深度优先搜索是用栈(push pop)。
  // 思路：
  // 集合初始元素是起点本身。之后，把能走到的点都放进来。
  // 放进来的点，也成为新的起点，所以再取出计算能走到的点，并放进来。
  // 直到找到终点，或集合为空。
  // const queue = [start];
  const queue = new Sorted(
    [start],
    (a, b) => (distance(a, end) - distance(b, end))
  );
  // const queue = new Sorted([start], end);
  const mapContainer = document.getElementById('map');

  const insert = async (x, y, previous) => {
    // 超出边界
    if (x < 0 || x > 99 || y < 0 || y > 99) return;
    // 不能走 或 走过了
    if (table[100 * x + y]) return;
    // 标记走过了，标记的值是上一个点，用来记录路径
    table[100 * x + y] = previous;
    await sleep(0);
    mapContainer.children[100 * x + y].setAttribute('style', `background-color: #4CAF50`);
    // queue.push([x, y]);
    queue.receive([x, y]);
  }

  while (queue.array.length) {
    let [x, y] = queue.give(); // A* 
    // let [x, y] = queue.shift(); // BFS
    // const [x, y] = queue.pop(); // DFS
    // 当找到终点
    if (x === end[0] && y === end[1]) {
      let path = [];
      // 从终点开始，再往回找，直到起点
      while (x !== start[0] || y !== start[1]) {
        // 记录路径，从中取回该点坐标
        path.push(table[100 * x + y]);

        // console.log(map[100 * x + y])
        // await sleep(0); // https://stackoverflow.com/questions/11214430/wrong-value-in-console-log 

        [x, y] = table[100 * x + y];
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
