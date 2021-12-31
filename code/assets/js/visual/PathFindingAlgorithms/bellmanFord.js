import {
	rowSize,
	colSize,
	endRow,
	endCol,
	startRow,
	startCol,
	manualStart,
	bellmanSteps,
	bellmanFordPath,
	startBtn,
	clearPathBtn,
	wallBtn,
	gridContainer,
} from "../Grid/index.js";
import { setWall } from "../Grid/createWalls.js";

const speedSlider = document.querySelector(".speedSlider");
let time = speedSlider.value;
let count = 1;
let pathCount = 1;
export const relaxations = 5;

//change color of a node during and after traversal
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

//update node color an cost during traversal
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

//relax nodes bellman ford algorithm
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

//highlight shortest path
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
			bellmanFordPath.push([parseInt(prow), parseInt(pcol)]);
		}
		endNode.setAttribute("class", "pathNode");
	}, 1000 * time + 100);
};

//original number of steps
export let bellmanStepsLength = 0;

//bellman ford algorithm function
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
	wallBtn.setAttribute("disabled", "true");

	let i = 0;
	let run = () => {
		setInterval(() => {
			if (i < relaxations) {
				relax(
					(x1 = 0),
					(y1 = 0),
					(x2 = rowSize - 1),
					(y2 = colSize - 1)
				);
				bellmanStepsLength = bellmanSteps.length;
				i++;
			} else {
				setTimeout(() => {
					startBtn.removeAttribute("disabled");
					clearPathBtn.removeAttribute("disabled");
					manualStart.removeAttribute("disabled");
					wallBtn.removeAttribute("disabled");
				}, pathCount * time + 100);
				clearInterval(run);
			}
			drawPath();
		}, 5000);
	};
	run();
};
