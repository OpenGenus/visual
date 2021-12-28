import {
	rowSize,
	colSize,
	algorithmType,
	manualStart,
	clearPath,
} from "../Grid/index.js";
import { setWall } from "../Grid/createWalls.js";

const gridContainer = document.querySelector("#gridContainer");
const speedSlider = document.querySelector(".speedSlider");
const stepsContainer = document.querySelector(".notification");
let time = speedSlider.value;
let startBtn = document.querySelector(".start");
let clearPathBtn = document.querySelector(".clearPath");
let bfsSteps = [];

const changeColor = (node, count, cost) => {
	setTimeout(() => {
		node.setAttribute("class", "chosenPath");
		if (cost) {
			node.innerHTML = cost;
		}
	}, count * time);
	setTimeout(() => {
		node.setAttribute("class", "pathColor");
	}, count * time + 100);
};

const checkUpdateNode = (row, col, curr, checker, visited, count) => {
	if (row >= 0 && col >= 0 && row < rowSize && col < colSize) {
		let node = document.querySelector(`div[row="${row}"][col="${col}"]`);
		let wall = parseInt(node.getAttribute("wall"));
		if (wall == 1) return;
		let prow = parseInt(curr.getAttribute("row"));
		let pcol = parseInt(curr.getAttribute("col"));
		if (algorithmType.classList.contains("dijkstras")) {
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
		}
		if (cost < node.getAttribute("cost")) {
			node.setAttribute(
				"parent",
				curr.getAttribute("row") + "|" + curr.getAttribute("col")
			);
			node.setAttribute("cost", cost);
		}

		//change color
		changeColor(curr, count, curr.getAttribute("cost"));
		if (!visited.includes(node)) {
			checker.push(node);
			bfsSteps.push([row, col, cost, prow, pcol]);
		}
		visited.push(node);
		return node;
	} else {
		return false;
	}
};

//algorithm implementation - bfs for unweighted, dijkstras for weighted
export const bfs = (x1 = 0, y1 = 0, x2 = rowSize - 1, y2 = colSize - 1) => {
	time = speedSlider.value;
	time = 40 + (time - 1) * -2;
	gridContainer.removeEventListener("mousedown", setWall);
	gridContainer.removeEventListener("mouseover", setWall);
	let startNode = document.querySelector(`div[row='${x1}'][col='${y1}']`);
	let endNode = document.querySelector(`div[row='${x2}'][col='${y2}']`);

	//disable start and clear path buttons
	startBtn.setAttribute("disabled", "true");
	clearPathBtn.setAttribute("disabled", "true");

	//start algorithm
	let visited = [startNode];
	let checker = [startNode];
	let count = 1;

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
		if (
			!algorithmType.classList.contains("dijkstras") &&
			row == x2 &&
			col == y2
		)
			break;
		let wall = parseInt(curr.getAttribute("wall"));
		if (wall == 1) continue;

		//check 4 sides of node, top, right, bottom, left
		checkUpdateNode(row + 1, col, curr, checker, visited, count);
		checkUpdateNode(row - 1, col, curr, checker, visited, count);
		checkUpdateNode(row, col - 1, curr, checker, visited, count);
		checkUpdateNode(row, col + 1, curr, checker, visited, count);
		count++;
	}

	//draw route
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
		endNode = document.querySelector(`div[row="${x2}"][col="${y2}`);
		endNode.setAttribute("class", "pathNode");
	}, count * time + 100);

	setTimeout(() => {
		startBtn.removeAttribute("disabled");
		clearPathBtn.removeAttribute("disabled");
		manualStart.removeAttribute("disabled");
	}, count * time + 100);
};

let stepsTitle = document.createElement("h4");
stepsTitle.textContent = "Algorithm Steps";
stepsContainer.append(stepsTitle);

const notification = (row, col, erow, ecol) => {
	var push = document.createElement("p");
	var explore = document.createElement("p");
	var line = document.createElement("hr");
	push.textContent = `Pushed node (${row}, ${col}) to queue.`;
	explore.textContent = `Now exploring (${erow}, ${ecol}).`;
	stepsContainer.appendChild(push);
	stepsContainer.appendChild(explore);
	stepsContainer.appendChild(line);
};

let isPath = true;
export const bfsStepper = () => {
	if (isPath) {
		clearPath();
		startBtn.setAttribute("disabled", "true");
		clearPathBtn.setAttribute("disabled", "true");
		stepsContainer.classList.remove("notification");
		stepsContainer.classList.add("show");
		isPath = false;
	}
	if (bfsSteps.length == 0) {
		alert("Completed Steps");
	} else {
		var cr = bfsSteps[0][0];
		var cc = bfsSteps[0][1];
		var cost = bfsSteps[0][2];
		var er = bfsSteps[0][3];
		var ec = bfsSteps[0][4];
		let node = document.querySelector(`div[row='${cr}'][col='${cc}']`);
		setTimeout(() => {
			node.setAttribute("class", "pathColor");
		}, 1000);
		notification(cr, cc, er, ec);
		node.setAttribute("class", "chosenPath");
		node.innerHTML = cost;
		bfsSteps.shift();
	}
};
