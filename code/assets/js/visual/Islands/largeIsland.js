import { rowSize, colSize } from "../Grid/index.js";
import { getGrid } from "./index.js";
import { setWall } from "../Grid/createWalls.js";

const gridContainer = document.querySelector("#gridContainer");
const speedSlider = document.querySelector(".speedSlider");
var time = speedSlider.value;
let bool = false;

let extensions = [];
let extensions2 = [];
let temp = [];
let islands = [];
let map = new Map();

class MaxIsland {
	//count largest island
	getMaxIsland = (grid, x, y, mapId) => {
		if (
			x >= grid.length ||
			y >= grid[0].length ||
			x < 0 ||
			y < 0 ||
			grid[x][y] !== 1
		)
			return 0;

		grid[x][y] = mapId;
		let count = 1;
		count += this.getMaxIsland(grid, x + 1, y, mapId);
		count += this.getMaxIsland(grid, x - 1, y, mapId);
		count += this.getMaxIsland(grid, x, y + 1, mapId);
		count += this.getMaxIsland(grid, x, y - 1, mapId);

		return count;
	};

	//flipping to get max
	largestIsland = (grid) => {
		let maxIsland = 0;
		let mapId = 2;
		let row = grid.length;
		let col = grid[0].length;
		for (let i = 0; i < row; i++) {
			for (let j = 0; j < col; j++) {
				if (grid[i][j] === 1) {
					map.set(mapId, this.getMaxIsland(grid, i, j, mapId, 0));
					mapId += 1;
					islands.push([mapId - 1, i, j]);
				}
			}
		}

		for (let m = 0; m < row; m++) {
			for (let n = 0; n < col; n++) {
				const ids = new Set();
				if (grid[m][n] === 0) {
					if (m < row - 1) ids.add(grid[m + 1][n]);
					if (m > 0) ids.add(grid[m - 1][n]);
					if (n < col - 1) ids.add(grid[m][n + 1]);
					if (n > 0) ids.add(grid[m][n - 1]);
					let sum = 0;
					ids.forEach((id) => {
						if (id !== 0) {
							sum += map.get(id);
						}
					});
					maxIsland = Math.max(sum + 1, maxIsland);
				}
				temp.push([ids, m, n]);
			}
		}
		return maxIsland === 0 ? row * col : maxIsland;
	};
}

class Visualize {
	changeColor = (node, count) => {
		setTimeout(() => {
			node.setAttribute("class", "chosenPath");
		}, count * time);
		setTimeout(() => {
			node.setAttribute("class", "pathColor");
		}, count * time + 100);
		setTimeout(() => {
			let wall = parseInt(node.getAttribute("wall"));
			if (wall == 1) {
				node.setAttribute("class", "beforeStart wall");
			}
		}, count * time + 100);
	};

	checker = (row, col) => {
		if (row >= 0 && col >= 0 && row < rowSize && col < colSize) return true;
		return false;
	};

	traverse = (node, visited, count, endNode) => {
		let row = parseInt(node.getAttribute("row"));
		let col = parseInt(node.getAttribute("col"));

		visited.push(node);
		this.changeColor(node, count);

		// Check all sides of a node
		let cr = row,
			cc = col;

		if (this.checker(cr + 1, cc)) {
			let child = document.querySelector(
				`div[row="${cr + 1}"][col="${cc}"]`
			);
			if (!visited.includes(child))
				this.traverse(child, visited, count + 1, endNode);
		}
		if (this.checker(cr, cc + 1)) {
			let child = document.querySelector(
				`div[row="${cr}"][col="${cc + 1}"]`
			);
			if (!visited.includes(child))
				this.traverse(child, visited, count + 1, endNode);
		}
		if (this.checker(cr - 1, cc)) {
			let child = document.querySelector(
				`div[row="${cr - 1}"][col="${cc}"]`
			);
			if (!visited.includes(child))
				this.traverse(child, visited, count + 1, endNode);
		}
		if (this.checker(cr, cc - 1)) {
			let child = document.querySelector(
				`div[row="${cr}"][col="${cc - 1}"]`
			);
			if (!visited.includes(child))
				this.traverse(child, visited, count + 1, endNode);
		}
	};

	visualizeMaxIsland = () => {
		time = speedSlider.value;
		time = 40 + (time - 1) * -2;
		gridContainer.removeEventListener("mousedown", setWall);
		gridContainer.removeEventListener("mouseover", setWall);
		let startNode = document.querySelector(`div[row='${0}'][col='${0}']`);
		let endNode = document.querySelector(`div[row='${0}'][col='${1}']`);

		//disable start button during visualization
		let startBtn = document.querySelector(".start");
		startBtn.setAttribute("disabled", true);

		let visited = [];
		let count = 1;
		bool = false;
		this.traverse(startNode, visited, count, endNode);
	};
}

export const maxIsland = () => {
	const visual = new Visualize();

	visual.visualizeMaxIsland();

	const island = new MaxIsland();
	let matGrid = getGrid();
	let largest = island.largestIsland(matGrid);

	let maxIsland = Math.max(...map.values());
	let maxId = [...map.entries()]
		.filter(({ 1: v }) => v === maxIsland)
		.map(([k]) => k)[0];

	//get now
	let mapVals = new Map();
	let vals = Array.from(map.values());
	let keys = Array.from(map.keys());
	for (let i = 0; i < vals.length; i++) {
		mapVals.set([keys[i]], vals[i]);
	}
	let vals1 = vals.flatMap((v, i) => vals.slice(i + 1).map((w) => [v, w]));
	let keys1 = keys.flatMap((v, i) => keys.slice(i + 1).map((w) => [v, w]));
	for (let i = 0; i < vals1.length; i++) {
		let sum = vals1[i].reduce((total, n) => parseInt(total) + parseInt(n));
		mapVals.set(keys1[i], sum);
	}

	for (let [key, value] of mapVals) {
		if (value !== largest - 1) {
			mapVals.delete(key);
		}
	}

	const getValue = (mapVals, srch) => {
		for (let [key, value] of mapVals.entries()) {
			if (value === srch) return key;
		}
	};

	let p1 = getValue(mapVals, largest - 1);

	if (p1 == null) {
		setTimeout(() => {
			alert("Largest island is " + rowSize * colSize);
		}, rowSize * colSize * time + 1000);
	} else if (p1.length > 1) {
		//filter sets of 3
		for (let i = 0; i < temp.length; i++) {
			if (temp[i][1] >= 0 && temp[i][2] >= 0 && temp[i][0].size == 3) {
				extensions.push(temp[i]);
			}
		}
	} else {
		// filter sets of 2
		for (let i = 0; i < temp.length; i++) {
			if (temp[i][1] >= 0 && temp[i][2] >= 0 && temp[i][0].size == 2) {
				extensions.push(temp[i]);
			}
		}
	}

	for (let i = 0; i < extensions.length; i++) {
		if (extensions[i][0].has(maxId)) {
			extensions2.push(extensions[i]);
		}
	}

	let toFlip;
	for (let i = 0; i < extensions.length; i++) {
		let arr = Array.from(extensions[i][0]);
		arr.sort((a, b) => a - b);
		arr.shift();
		for (let [key, val] of mapVals.entries()) {
			if (JSON.stringify(key) == JSON.stringify(arr)) {
				toFlip = arr;
			}
		}
	}

	let final = [];

	for (let i = 0; i < extensions.length; i++) {
		if (toFlip !== null) {
			if (
				extensions[i][0].has(toFlip[0]) &&
				extensions[i][0].has(toFlip[1])
			) {
				final.push(extensions[i]);
			}
		}
	}

	setTimeout(() => {
		if (p1.length > 1) {
			let node = document.querySelector(
				`div[row='${final[0][1]}'][col='${final[0][2]}']`
			);
			node.style.backgroundColor = "yellow";
		} else {
			let node = document.querySelector(
				`div[row='${extensions2[0][1]}'][col='${extensions2[0][2]}']`
			);
			node.style.backgroundColor = "yellow";
		}
		alert("The largest island is of size " + largest);
		// window.location.reload();
	}, rowSize * colSize * time + 1000);
};
