import {
	rowSize,
	colSize,
	startRow,
	endRow,
	startCol,
	endCol,
	algorithmType,
} from "./index.js";

const genRandom = (maxVal) => {
	return (Math.random() * (maxVal - 1)) % maxVal;
};

const createNode = (row, col, weight) => {
	var node = document.createElement("div");
	node.setAttribute("class", "beforeStart");
	node.setAttribute("row", row);
	node.setAttribute("col", col);
	node.setAttribute("wall", 0);
	node.setAttribute("parent", null);
	node.setAttribute("cost", Number.POSITIVE_INFINITY);
	node.setAttribute("weight", weight);
	node.innerText = weight.toString();
	return node;
};

const updateNode = (node, row, col, weight, wall) => {
	node.setAttribute("row", row);
	node.setAttribute("col", col);
	node.setAttribute("parent", null);
	node.setAttribute("class", "beforeStart");
	node.setAttribute("cost", Number.POSITIVE_INFINITY);
	node.setAttribute("weight", weight);
	node.innerText = weight.toString();
	if (wall == 1) {
		node.setAttribute("wall", 1);
		node.className += " wall";
	} else {
		node.setAttribute("wall", 0);
	}
	return node;
};

const createEmptyNode = (row, col) => {
	var node = document.createElement("div");
	node.setAttribute("row", row);
	node.setAttribute("col", col);
	node.setAttribute("wall", 0);
	node.setAttribute("parent", null);
	node.setAttribute("class", "beforeStart");
	node.setAttribute("border", "1px solid #000");
	node.setAttribute("cost", Number.POSITIVE_INFINITY);
	return node;
};

const updateEmptyNode = (node, row, col, wall) => {
	node.setAttribute("row", row);
	node.setAttribute("col", col);
	node.setAttribute("class", "beforeStart");
	node.setAttribute("parent", null);
	node.setAttribute("border", "1px solid #000");
	node.setAttribute("cost", Number.POSITIVE_INFINITY);
	node.innerText = "";
	if (wall == 1) {
		node.setAttribute("wall", 1);
		node.className += " wall";
	} else {
		node.setAttribute("wall", 0);
	}
	return node;
};

export const createBoard = () => {
	var grid = document.querySelector("#gridContainer");
	grid.innerHTML = "";
	for (var i = 0; i < rowSize; i++) {
		for (var j = 0; j < colSize; j++) {
			let weight = Math.round(genRandom(5));
			let newNode = createNode(i, j, weight);
			grid.appendChild(newNode);
		}
	}
};

export const createEmptyBoard = () => {
	var grid = document.querySelector("#gridContainer");
	grid.innerHTML = "";
	for (var i = 0; i < rowSize; i++) {
		for (var j = 0; j < colSize; j++) {
			let newNode = createEmptyNode(i, j);
			grid.appendChild(newNode);
		}
	}
};

export const createStartNode = (x1 = 0, y1 = 0) => {
	var startNode = document.querySelector(`div[row='${x1}'][col='${y1}']`);
	startNode.setAttribute("cost", 0);
	startNode.setAttribute("class", "pathNode");
	startNode.innerHTML = "A";
};

export const createEndNode = (x2 = rowSize - 1, y2 = colSize - 1) => {
	var endNode = document.querySelector(`div[row='${x2}'][col='${y2}']`);
	endNode.setAttribute("class", "pathNode");
	endNode.innerHTML = "B";
};

const jump = (x1 = 0, y1 = 0) => {
	var node = document.querySelector(`div[row='${x1}'][col='${y1}']`);
};
jump();

export const refreshBoard = () => {
	for (var i = 0; i < rowSize; i++) {
		for (var j = 0; j < colSize; j++) {
			var node = document.querySelector(`div[row="${i}"][col="${j}"]`);
			let weight = Math.round(genRandom(5));
			if (node.getAttribute("wall") == 1) {
				updateNode(node, i, j, weight, 1);
			} else {
				updateNode(node, i, j, weight, 0);
			}
		}
	}
	if (
		algorithmType.classList.contains("bfs") ||
		algorithmType.classList.contains("dfs")
	) {
		createStartNode(startRow, startCol);
		createEndNode(endRow, endCol);
	} else if (algorithmType.classList.contains("numIslands")) {
		createStartIsland(startRow, startCol);
		createEndIsland(endRow, endCol);
	}
};

export const refreshEmptyBoard = () => {
	for (var i = 0; i < rowSize; i++) {
		for (var j = 0; j < colSize; j++) {
			var node = document.querySelector(`div[row="${i}"][col="${j}"]`);
			if (node.getAttribute("wall") == 1) {
				updateEmptyNode(node, i, j, 1);
			} else {
				updateEmptyNode(node, i, j, 0);
			}
		}
	}
	if (
		algorithmType.classList.contains("bfs") ||
		algorithmType.classList.contains("dfs")
	) {
		createStartNode(startRow, startCol);
		createEndNode(endRow, endCol);
	} else if (algorithmType.classList.contains("numIslands")) {
		createStartIsland(startRow, startCol);
		createEndIsland(endRow, endCol);
	}
};
