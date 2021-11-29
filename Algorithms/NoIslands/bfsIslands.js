import { rowSize, colSize, weightType } from "../GridAlgorithms/index.js";
import { setWall } from "../GridAlgorithms/createWalls.js";

const gridContainer = document.querySelector("#gridContainer");
const speedSlider = document.querySelector(".speedSlider");
var time = speedSlider.value;

class NumberOfIslands {
	getGrid() {
		let gridMatrix = [];
		let matrix = [];

		for (let i = 0; i < rowSize; i++) {
			for (let j = 0; j < colSize; j++) {
				var node = document.querySelector(
					`div[row="${i}"][col="${j}"]`
				);
				var wall = parseInt(node.getAttribute("wall"));
				gridMatrix.push(wall);
			}
		}
		while (gridMatrix.length) {
			matrix.push(gridMatrix.splice(0, colSize));
		}
		return matrix;
	}

	isSafe = (mat, i, j, vis, r, c) => {
		return (
			i >= 0 && i < r && j >= 0 && j < c && mat[i][j] == 1 && !vis[i][j]
		);
	};

	bfs = (mat, vis, si, sj, r, c) => {
		let row = [-1, -1, -1, 0, 0, 1, 1, 1];
		let col = [-1, 0, 1, -1, 1, -1, 0, 1];

		let q = [];
		q.push([si, sj]);
		vis[si][sj] = true;

		while (q.length != 0) {
			let i = q[0][0];
			let j = q[0][1];
			q.shift();

			for (let k = 0; k < 8; k++) {
				if (this.isSafe(mat, i + row[k], j + col[k], vis, r, c)) {
					vis[i + row[k]][j + col[k]] = true;
					q.push([i + row[k], j + col[k]]);
				}
			}
		}
	};

	countIslands = (mat, r, c) => {
		let vis = new Array(r);
		for (let i = 0; i < c; i++) {
			vis[i] = new Array(c);
			for (let j = 0; j < r; j++) {
				vis[i][j] = false;
			}
		}
		let res = 0;
		for (let i = 0; i < r; i++) {
			for (let j = 0; j < c; j++) {
				if (mat[i][j] == 1 && !vis[i][j]) {
					this.bfs(mat, vis, i, j, r, c);
					res++;
				}
			}
		}
		return res;
	};
}

class Visualize {
	changeColor = (node, count, cost) => {
		setTimeout(() => {
			node.setAttribute("class", "chosenPath");
		}, count * time);
	};

	checkUpdateNode = (row, col, curr, checker, visited, count) => {
		if (row >= 0 && col >= 0 && row < rowSize && col < colSize) {
			var node = document.querySelector(
				`div[row="${row}"][col="${col}"]`
			);
			let wall = parseInt(node.getAttribute("wall"));
			if (wall == 1) return;
			let prow = parseInt(curr.getAttribute("row"));
			let pcol = parseInt(curr.getAttribute("col"));
			if (weightType == "weighted") {
				var cost = Math.min(
					parseInt(curr.getAttribute("cost")) +
						parseInt(node.getAttribute("weight")),
					node.getAttribute("cost")
				);
			} else {
				var cost = Math.min(
					parseInt(curr.getAttribute("cost")) +
						Math.abs(Math.abs(prow - row) + Math.abs(pcol - col)),
					node.getAttribute("cost")
				);
				if (cost < node.getAttribute("cost")) {
					node.setAttribute(
						"parent",
						curr.getAttribute("row") +
							"|" +
							curr.getAttribute("col")
					);
					node.setAttribute("cost", cost);
				}

				//change color
				this.changeColor(curr, count, curr.getAttribute("cost"));
				if (!visited.includes(node)) {
					checker.push(node);
				}
				visited.push(node);
				return node;
			}
		} else {
			return false;
		}
	};

	//bfs algorithm implementation
	visualizeBFS = (x1 = 0, y1 = 0, x2 = rowSize - 1, y2 = colSize - 1) => {
		time = speedSlider.value;
		time = 40 + (time - 1) * -2;
		gridContainer.removeEventListener("mousedown", setWall);
		gridContainer.removeEventListener("mouseover", setWall);
		var startNode = document.querySelector(`div[row='${x1}'][col='${y1}']`);

		//disable start and refresh btn
		var startBtn = document.querySelector(".start");
		startBtn.style.visibility = "hidden";
		var clearPathBtn = document.querySelector(".clearPath");
		clearPathBtn.style.visibility = "hidden";

		//start algorithm
		var visited = [startNode];
		var checker = [startNode];
		var count = 1;

		while (checker.length != 0) {
			checker.sort((a, b) => {
				if (
					parseInt(a.getAttribute("cost")) <
					parseInt(b.getAttribute("cost"))
				)
					return 1;
				if (
					parseInt(a.getAttribute("cost")) >
					parseInt(b.getAttribute("cost"))
				)
					return -1;
				return 0;
			});
			let curr = checker.pop();
			let row = parseInt(curr.getAttribute("row"));
			let col = parseInt(curr.getAttribute("col"));
			if (weightType == "Unweighted" && row == x2 && col == y2) break;
			let wall = parseInt(curr.getAttribute("wall"));
			if (wall == 1) continue;

			//check 4 sides of node
			let nextRow = row + 1;
			let prevRow = row - 1;
			let leftCol = col - 1;
			let rightCol = col + 1;
			this.checkUpdateNode(nextRow, col, curr, checker, visited, count);
			this.checkUpdateNode(prevRow, col, curr, checker, visited, count);
			this.checkUpdateNode(row, leftCol, curr, checker, visited, count);
			this.checkUpdateNode(row, rightCol, curr, checker, visited, count);
			count++;
		}

		const numIslands = new NumberOfIslands();
		let matGrid = numIslands.getGrid();

		setTimeout(() => {
			startBtn.style.visibility = "visible";
			alert(
				"There are " +
					numIslands.countIslands(matGrid, rowSize, colSize) +
					" islands."
			);
		}, count * time + 1000);
	};
}

export const bfsIslands = (r, c) => {
	const visual = new Visualize();
	visual.visualizeBFS(0, 0, rowSize - 1, colSize - 1);
};
