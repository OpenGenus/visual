const bell = (graph, V, E, src) => {
	let distance = Array(V).fill(1000000000);
	distance[src] = 0;

	for (let i = 0; i < V - 1; i++) {
		for (let j = 0; j < E; j++) {
			if (distance[graph[j][0]] + graph[j][2] < distance[graph[j][1]])
				distance[graph[j][1]] = distance[graph[j][0]] + graph[j][2];
		}
	}

	for (let i = 0; i < E; i++) {
		let x = graph[i][0];
		let y = graph[i][1];
		let weight = graph[i][2];
		if (distance[x] != 1000000000 && distance[x] + weight < distance[y])
			console.log("Graph has a negative weight cycle");
	}

	for (let i = 0; i < V; i++) console.log("Distance = ", distance[i]);
};

let V = 5;
let E = 8;

let graph = [
	[0, 1, -1],
	[0, 2, 4],
	[1, 2, 3],
	[1, 3, 2],
	[1, 4, 2],
	[3, 2, 5],
	[3, 1, 1],
	[4, 3, -3],
];

console.log(bell(graph, V, E, 0));

var count = 1;
let dx = [-1, 1, 0, 0];
let dy = [0, 0, -1, 1];
let find = false;
for (let i = 0; i < rowSize; i++) {
	for (let j = 0; j < colSize; j++) {
		for (let k = 0; k < dx.length; k++) {
			let nextX = i + dx[k];
			let nextY = j + dy[k];
			// console.log("X:" + nextX);
			// console.log("Y:" + nextY);
			var curr = document.querySelector(`div[row="${i}"][col="${j}"]`);
			let wall = parseInt(curr.getAttribute("wall"));

			if (nextX < 0 || nextX >= rowSize || nextY < 0 || nextY >= colSize)
				continue;
			if (
				dist[i][j] == Infinity ||
				dist[i][j] + 1 >= dist[nextX][nextY]
			) {
				continue;
			}

			if (wall == 1) continue;

			dist[nextX][nextY] = dist[i][j] + 1;
			prev[nextX][nextY] = { x: i, y: j };

			if (nextX == x2 && nextY == y2) {
				console.log("arrived");
				find = true;
				break;
			}

			checkUpdateNode(nextX, nextY, curr, count);
			console.log("here");
			count++;
		}
		if (find) break;
	}
}
//   return { time, find };
setTimeout(() => {
	clearPathBtn.style.visibility = "visible";
}, count * time + 100);
// return count;

// let V = rowSize * colSize;
// let E = 39 * 39 + 19 * 19;
// let distance = Array(rowSize * colSize).fill(100000000);
// distance[startNode] = 0;

// let dist = new Array(rowSize);
// let prev = new Array(colSize);
// for (let i = 0; i < rowSize; i++) {
// 	dist[i] = [];
// 	prev[i] = [];
// 	for (let j = 0; j < colSize; j++) {
// 		dist[i][j] = Infinity;
// 		prev[i][j] = { x: -1, y: -1 };
// 	}
// }

// for(let i = 0; i < V - 1; i++){
// 	for(let j = 0; j < E; j++){
// 		var node = document.querySelector(`div[row="${i}"][col="${j}"]`);
// 		let cost = parseInt(node.getAttribute("cost"));
// 		if(dist[cost] + dist[cost]){
// 			dist[graph[j][1]] = dist[graph[j][0]] + graph[j][2]
// 		}
// 	}
// }
