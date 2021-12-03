import { rowSize, colSize } from "../Grid/index.js";
import { setWall } from "../Grid/createWalls.js";
import { getGrid } from "./index.js";

// get from DOM
const gridContainer = document.querySelector("#gridContainer");
const speedSlider = document.querySelector(".speedSlider");
var time = speedSlider.value;
let bool = false;

class NumberOfIslands {
	// without visited matrix
	dfs = (matrix, i, j, row, col) => {
		if (i < 0 || j < 0 || i > row - 1 || j > col - 1 || matrix[i][j] != 1) {
			return;
		}
		if (matrix[i][j] == 1) {
			//check neighbors
			matrix[i][j] = 0;
			this.dfs(matrix, i + 1, j, row, col); //right
			this.dfs(matrix, i - 1, j, row, col); //left
			this.dfs(matrix, i, j + 1, row, col); //up
			this.dfs(matrix, i, j - 1, row, col); //down
			this.dfs(matrix, i + 1, j + 1, row, col); //up-right
			this.dfs(matrix, i - 1, j - 1, row, col); //down-left
			this.dfs(matrix, i + 1, j - 1, row, col); //down-right
			this.dfs(matrix, i - 1, j + 1, row, col); //up-left
		}
	};

	countIslands = (matrix) => {
		let row = matrix.length;
		let col = matrix[0].length;
		let count = 0;
		for (let i = 0; i < row; i++) {
			for (let j = 0; j < col; j++) {
				if (matrix[i][j] == 1) {
					//check neighbors
					matrix[i][j] = 0;
					count++;
					this.dfs(matrix, i + 1, j, row, col); //right
					this.dfs(matrix, i - 1, j, row, col); //left
					this.dfs(matrix, i, j + 1, row, col); //up
					this.dfs(matrix, i, j - 1, row, col); //down
					this.dfs(matrix, i + 1, j + 1, row, col); //up-right
					this.dfs(matrix, i - 1, j - 1, row, col); //down-left
					this.dfs(matrix, i + 1, j - 1, row, col); //down-right
					this.dfs(matrix, i - 1, j + 1, row, col); //up-left
				}
			}
		}
		return count;
	};
}

class Visualize {
	changeColor = (node, count) => {
		setTimeout(() => {
			node.setAttribute("class", "chosenPath");
		}, count * time);
		// draw path blue
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

	visualizeDFS = () => {
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

		const numIslands = new NumberOfIslands();
		let matGrid = getGrid();
		return numIslands.countIslands(matGrid);
	};
}

export const dfsIslands = () => {
	const visual = new Visualize();
	let islands = visual.visualizeDFS();
	setTimeout(() => {
		alert(
			islands == 0
				? "No islands found, create some islands"
				: "Number of islands: " + islands
		);
		window.location.reload();
	}, rowSize * colSize * time + 1000);
};
