import {
	rowSize,
	colSize,
	endRow,
	endCol,
	startRow,
	startCol,
	manualStart,
	clearPath,
	notification,
	stepsContainer,
} from "../Grid/index.js";
import { setWall } from "../Grid/createWalls.js";

const gridContainer = document.querySelector("#gridContainer");
const speedSlider = document.querySelector(".speedSlider");
let startBtn = document.querySelector(".start");
let clearPathBtn = document.querySelector(".clearPath");
let time = speedSlider.value;
let count = 1;
let pathCount = 1;
let bellmanSteps = [];

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
		let cost = Math.min(
			parseInt(curr.getAttribute("cost")) +
				parseInt(node.getAttribute("weight")),
			node.getAttribute("cost")
		);

		if (cost < node.getAttribute("cost")) {
			node.setAttribute(
				"parent",
				curr.getAttribute("row") + "|" + curr.getAttribute("col")
			);
			node.setAttribute("cost", cost);
		}

		let prow = parseInt(curr.getAttribute("row"));
		let pcol = parseInt(curr.getAttribute("col"));

		//change color
		changeColor(curr, count, curr.getAttribute("cost"));
		if (!visited.includes(node)) {
			checker.push(node);
			bellmanSteps.push([row, col, cost, prow, pcol]);
		}
		visited.push(node);
		return node;
	} else {
		return false;
	}
};

const relax = (x1 = 0, y1 = 0, x2 = rowSize - 1, y2 = colSize - 1) => {
	let startNode = document.querySelector(`div[row='${x1}'][col='${y1}']`);
	//start algorithm
	let visited = [startNode];
	let checker = [startNode];

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

		let wall = parseInt(curr.getAttribute("wall"));
		if (wall == 1) continue;

		//check 4 sides of node, top, right, bottom, left
		checkUpdateNode(row + 1, col, curr, checker, visited, count);
		checkUpdateNode(row - 1, col, curr, checker, visited, count);
		checkUpdateNode(row, col - 1, curr, checker, visited, count);
		checkUpdateNode(row, col + 1, curr, checker, visited, count);
		count++;
		pathCount++;
	}
};

const drawPath = () => {
	let startNode = document.querySelector(
		`div[row='${startRow}'][col='${startCol}']`
	);
	let endNode = document.querySelector(
		`div[row='${endRow}'][col='${endCol}']`
	);
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
		endNode.setAttribute("class", "pathNode");
	}, 1000 * time + 100);
};

export const bellmanFord = (
	x1 = 0,
	y1 = 0,
	x2 = rowSize - 1,
	y2 = colSize - 1
) => {
	time = speedSlider.value;
	time = 40 + (time - 1) * -2;
	gridContainer.removeEventListener("mousedown", setWall);
	gridContainer.removeEventListener("mouseover", setWall);

	//disable start and clear path buttons
	startBtn.setAttribute("disabled", "true");
	clearPathBtn.setAttribute("disabled", "true");

	let relaxations = 1;
	let run = () => {
		setInterval(() => {
			if (relaxations < 6) {
				relax(
					(x1 = 0),
					(y1 = 0),
					(x2 = rowSize - 1),
					(y2 = colSize - 1)
				);
				relaxations++;
			} else {
				setTimeout(() => {
					startBtn.removeAttribute("disabled");
					clearPathBtn.removeAttribute("disabled");
					manualStart.removeAttribute("disabled");
				}, pathCount * time + 100);
				clearInterval(run);
			}
			drawPath();
		}, 5000);
	};
	run();
};

let isPath = true;
export const bellmanStepper = () => {
	if (isPath) {
		clearPath();
		startBtn.setAttribute("disabled", "true");
		clearPathBtn.setAttribute("disabled", "true");
		stepsContainer.classList.remove("notification");
		stepsContainer.classList.add("show");
		isPath = false;
	}
	if (bellmanSteps.length == 0) {
		alert("Completed Steps");
	} else {
		var cr = bellmanSteps[0][0];
		var cc = bellmanSteps[0][1];
		var cost = bellmanSteps[0][2];
		var er = bellmanSteps[0][3];
		var ec = bellmanSteps[0][4];
		let node = document.querySelector(`div[row='${cr}'][col='${cc}']`);
		setTimeout(() => {
			node.setAttribute("class", "pathColor");
		}, 1000);
		node.setAttribute("class", "chosenPath");
		node.innerHTML = cost || Infinity;
		notification(cr, cc, er, ec);
		bellmanSteps.shift();
	}
};
