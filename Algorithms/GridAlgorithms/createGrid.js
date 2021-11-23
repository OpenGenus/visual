import {
	rowSize,
	colSize,
	startRow,
	endRow,
	startCol,
	endCol,
} from "./index.js";

const genRandom = (maxVal) => {
	return (Math.random() * (max - 1)) % maxVal;
};

const createNode = (row, col) => {
	var node = document.createElement("div");
	node.setAttribute("id", "beforeStart");
	node.setAttribute("row", row);
	node.setAttribute("col", col);
	node.setAttribute("wall", 0);
	node.setAttribute("parent", null);
	return node;
};

const createEmptyNode = (row, col) => {
	var node = document.createElement("div");
	node.setAttribute("class", "beforeStart");
	node.setAttribute("row", row);
	node.setAttribute("col", col);
	node.setAttribute("wall", 0);
	node.setAttribute("parent", null);
	node.setAttribute("border", "1px solid #000");
	return node;
};

export const createBoard = () => {
	var grid = document.querySelector("#gridContainer");
	grid.innerHTML = "";
	for (var i = 0; i < rowSize; i++) {
		for (var j = 0; j < colSize; j++) {
			let newNode = createEmptyNode(i, j);
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
	startNode.setAttribute("class", "pathNode");
	startNode.innerHTML = "A";
};

export const createEndNode = (x2 = rowSize - 1, y2 = colSize - 1) => {
	var endNode = document.querySelector(`div[row='${x2}'][col='${y2}']`);
	endNode.setAttribute("class", "pathNode");
	endNode.innerHTML = "B";
};
