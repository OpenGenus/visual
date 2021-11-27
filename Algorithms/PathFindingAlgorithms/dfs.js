import { setWall } from "../GridAlgorithms/createWalls.js";
import { rowSize, colSize } from "../GridAlgorithms/index.js";

let gridContainer = document.querySelector("#gridContainer");
let speedSlider = document.querySelector(".speedSlider");
let time = speedSlider.value;
let bool = false;

const checker = (row, col) => {
	if (row >= 0 && col >= 0 && row < rowSize && col < colSize) return true;
	return false;
};

//traverse grid
const traverse = (node, visited, count, endNode) => {
	let row = parseInt(node.getAttribute("row"));
	let col = parseInt(node.getAttribute("col"));
	if (bool || node == endNode) {
		bool = true;
		return;
	}
	let wall = parseInt(node.getAttribute("wall"));
	if (wall == 1) return;
	visited.push(node);
	changeColor(node, count);

	// Check all sides of a node
	let cr = row,
		cc = col;

	if (checker(cr + 1, cc)) {
		let child = document.querySelector(`div[row="${cr + 1}"][col="${cc}"]`);
		if (!visited.includes(child))
			traverse(child, visited, count + 1, endNode);
	}
	if (checker(cr, cc + 1)) {
		let child = document.querySelector(`div[row="${cr}"][col="${cc + 1}"]`);
		if (!visited.includes(child))
			traverse(child, visited, count + 1, endNode);
	}
	if (checker(cr - 1, cc)) {
		let child = document.querySelector(`div[row="${cr - 1}"][col="${cc}"]`);
		if (!visited.includes(child))
			traverse(child, visited, count + 1, endNode);
	}
	if (checker(cr, cc - 1)) {
		let child = document.querySelector(`div[row="${cr}"][col="${cc - 1}"]`);
		if (!visited.includes(child))
			traverse(child, visited, count + 1, endNode);
	}
};

// visualize algorithm
const changeColor = (node, count) => {
	setTimeout(() => {
		node.setAttribute("class", "pathNode");
		node.innerHTML = count;
	}, count * time);
	setTimeout(() => {
		node.setAttribute("class", "chosenPath");
	}, count * time + 100);
}; // End changeColor

export const dfs = (x1 = 0, y1 = 0, x2 = rowSize - 1, y2 = colSize - 1) => {
	time = speedSlider.value;
	time = 40 + (time - 1) * -2;
	gridContainer.removeEventListener("mousedown", setWall);
	gridContainer.removeEventListener("mouseover", setWall);
	let startNode = document.querySelector(`div[row='${x1}'][col='${y1}']`);
	let endNode = document.querySelector(`div[row='${x2}'][col='${y2}']`);

	//hide start and clear path buttons
	let startBtn = document.querySelector(".start");
	let clearPathBtn = document.querySelector(".clearPath");
	startBtn.style.visibility = "hidden";
	clearPathBtn.style.visibility = "hidden";

	let visited = [];
	let count = 1;
	bool = false;
	traverse(startNode, visited, count, endNode);

	// draw route
	setTimeout(() => {
		startNode.setAttribute("class", "pathNode");
		while (endNode.getAttribute("parent") != "null") {
			endNode.setAttribute("class", "chosenPath");
			let coor = endNode.getAttribute("parent").split("|");
			let prow = parseInt(coor[0]);
			let pcol = parseInt(coor[1]);
			endNode = document.querySelector(
				`div[row="${prow}"][col="${pcol}"]`
			);
		}
		endNode = document.querySelector(`div[row="${x2}"][col="${y2}"]`);
		endNode.setAttribute("class", "ends");
	}, count * time + 100);
	setTimeout(() => {
		refreshBtn.style.visibility = "visible";
	}, count * time + 100);
};
