import {
	createEmptyBoard,
	createBoard,
	createStartNode,
	createEndNode,
	refreshBoard,
	refreshEmptyBoard,
} from "./createGrid.js";
import { setWall } from "./createWalls.js";
import { setObstacles } from "./generateObstacles.js";
import { dfs } from "../PathFindingAlgorithms/dfs.js";
import { bfs } from "../PathFindingAlgorithms/bfs.js";
import { bfsIslands } from "../Islands/bfsIslands.js";
import { dfsIslands } from "../Islands/dfsIslands.js";
import { maxIsland } from "../Islands/largeIsland.js";
import {
	bellmanFord,
	relaxations,
	bellmanStepsLength,
} from "../PathFindingAlgorithms/bellmanFord.js";

// get dom elements
export const gridContainer = document.querySelector("#gridContainer");
export const clearPathBtn = document.querySelector(".clearPath");
export const resetBtn = document.querySelector(".reset");
const weightBtn = document.querySelector(".weight");
const algoBtn = document.querySelector(".algo");
export const startBtn = document.querySelector(".start");
export const wallBtn = document.querySelector(".setWalls");
export const speedSlider = document.querySelector(".speedSlider");
const islandAlgoBtn = document.querySelector(".islandsAlgo");
export const stepsContainer = document.querySelector(".notification");
export const algorithmType = document.querySelector(".algorithm");
export var manualStart = document.querySelector(".manual");
manualStart.setAttribute("disabled", "true");

//global variables
export var rowSize = 20;
export var colSize = 40;
export var startRow = 4;
export var startCol = 5;
export var endRow = 15;
export var endCol = 32;
export var mouseDown = false;
export var weightType = weightBtn.options[weightBtn.selectedIndex].value;
export var algorithm = algoBtn.options[algoBtn.selectedIndex].value;
export var islandAlgo =
	islandAlgoBtn.options[islandAlgoBtn.selectedIndex].value;

//steps arrays
export let bfsSteps = [];
export let dfsSteps = [];
export let bellmanSteps = [];
export let dijkstrasPath = [];
export let bellmanFordPath = [];

//event listeners
gridContainer.addEventListener("mousedown", () => {
	mouseDown = true;
});
gridContainer.addEventListener("mouseup", () => {
	mouseDown = false;
});
gridContainer.addEventListener("mouseover", () => {
	setWall;
});
wallBtn.addEventListener("click", setObstacles);

islandAlgoBtn.addEventListener("change", () => {
	window.location.reload();
});

//clear path after traversal
export const clearPath = () => {
	gridContainer.addEventListener("mousedown", setWall);
	gridContainer.addEventListener("mouseup", setWall);
	gridContainer.addEventListener("mouseover", setWall);
	if (
		algorithmType.classList.contains("bfs") ||
		algorithmType.classList.contains("dfs") ||
		algorithmType.classList.contains("numIslands") ||
		algorithmType.classList.contains("maxIsland")
	) {
		refreshEmptyBoard();
	} else if (
		algorithmType.classList.contains("dijkstras") ||
		algorithmType.classList.contains("bellman-ford")
	) {
		refreshBoard();
	}
	startBtn.style.visibility = "visible";
};

resetBtn.addEventListener("click", () => location.reload());
clearPathBtn.addEventListener("click", clearPath);

//display steps
let stepsTitle = document.createElement("h4");
stepsTitle.classList.add("stepsTitle");
stepsTitle.textContent = "Algorithm Steps";
stepsContainer.append(stepsTitle);

//log steps for algorithm
export const notification = (row, col, erow, ecol, cost, prevCost) => {
	var step = document.createElement("div");
	step.classList.add("step");
	var push = document.createElement("p");
	var explore = document.createElement("p");
	var costText = document.createElement("p");
	if (algorithmType.classList.contains("bellman-ford")) {
		if (bellmanSteps.length == 0) {
			push.textContent = `Selected (${row}, ${col}) as path.`;
		} else {
			if (
				bellmanSteps.length <=
				bellmanStepsLength - bellmanStepsLength / relaxations
			) {
				push.textContent = `Relaxing (${row}, ${col}): current cost ${prevCost}, updated cost ${
					cost || "inf"
				}.`;
			} else {
				push.textContent = `Pushed (${row}, ${col}) to dist[] array.`;
				explore.textContent = `Exploring (${erow}, ${ecol}).`;
			}
		}
	} else if (
		algorithmType.classList.contains("dijkstras") ||
		algorithmType.classList.contains("bfs")
	) {
		if (bfsSteps.length == 0) {
			push.textContent = `Selected (${row}, ${col}) as path.`;
		} else {
			push.textContent = `Pushed (${row}, ${col}) to array.`;
			explore.textContent = `Processing (${erow}, ${ecol}).`;
			costText.textContent = `Cost from source is ${cost}`;
		}
	} else if (algorithmType.classList.contains("dfs")) {
		if (row == erow && col == ecol) {
			push.textContent = `Pushed (${erow}, ${ecol}) to stack.`;
			explore.textContent = `Exploring (${erow}, ${ecol}).`;
		} else {
			push.textContent = `Popped (${row}, ${col}) from stack.`;
		}
	}
	step.appendChild(push);
	step.appendChild(explore);
	step.appendChild(costText);
	stepsContainer.append(step);
	stepsContainer.scrollTop = stepsContainer.scrollHeight;

	step.addEventListener("click", () => {
		let node = document.querySelector(`div[row='${row}'][col='${col}']`);
		let node1 = document.querySelector(`div[row='${erow}'][col='${ecol}']`);
		setTimeout(() => {
			node.setAttribute("class", "pathColor");
			// node1.setAttribute("class", "pathColor");
		}, 1000);
		node.setAttribute("class", "chosenPath");
		// node1.setAttribute("class", "chosenPath");
	});
};

// step by step visualization
let isPath = true;
export const stepper = (steps) => {
	gridContainer.removeEventListener("mousedown", setWall);
	gridContainer.removeEventListener("mouseover", setWall);
	// wallBtn.setAttribute("disabled", true);
	if (isPath) {
		clearPath();
		bellmanFordPath.splice(
			0,
			bellmanFordPath.length - bellmanFordPath.length / 5
		);
		startBtn.setAttribute("disabled", "true");
		clearPathBtn.setAttribute("disabled", "true");
		stepsContainer.classList.remove("notification");
		stepsContainer.classList.add("show");
		wallBtn.setAttribute("disabled", "true");
		isPath = false;
	}
	if (steps.length == 0) {
		if (
			algorithmType.classList.contains("dijkstras") ||
			algorithmType.classList.contains("bfs")
		) {
			if (dijkstrasPath.length == 0) {
				alert("Steps completed!");
			} else {
				//draw path
				var pcol = dijkstrasPath[0][0];
				var prow = dijkstrasPath[0][1];
				setTimeout(() => {
					node.setAttribute("class", "pathColor");
				}, 1000);
				node.setAttribute("class", "chosenPath");
				notification(pcol, prow, 0, 0);
				dijkstrasPath.shift();
			}
		} else if (algorithmType.classList.contains("bellman-ford")) {
			if (bellmanFordPath.length == 0) {
				alert("Bellman ford steps completed!");
			} else {
				//draw path
				var pcol = bellmanFordPath[0][0];
				var prow = bellmanFordPath[0][1];
				let node = document.querySelector(
					`div[row='${pcol}'][col='${prow}']`
				);
				node.setAttribute("class", "chosenPath");
				notification(pcol, prow, 0, 0);
				bellmanFordPath.shift();
			}
		} else {
			alert("Completed Steps");
		}
	} else {
		var cr = steps[0][0];
		var cc = steps[0][1];
		var cost = steps[0][2];
		var er = steps[0][3];
		var ec = steps[0][4];
		let node = document.querySelector(`div[row='${cr}'][col='${cc}']`);
		setTimeout(() => {
			node.setAttribute("class", "pathColor");
		}, 1000);
		node.setAttribute("class", "chosenPath");
		//relaxation for bellman ford nodes
		let prevCost = node.innerHTML;
		node.innerHTML = cost || "inf";
		notification(cr, cc, er, ec, cost, prevCost);
		steps.shift();
	}
};

//run normal visualization
const startVisualization = () => {
	if (algorithmType.classList.contains("bfs")) {
		bfs(startRow, startCol, endRow, endCol);
		manualStart.addEventListener("click", () => {
			stepper(bfsSteps);
		});
	} else if (algorithmType.classList.contains("dfs")) {
		dfs(startRow, startCol, endRow, endCol);
		manualStart.addEventListener("click", () => {
			stepper(dfsSteps);
		});
	} else if (algorithmType.classList.contains("dijkstras")) {
		bfs(startRow, startCol, endRow, endCol);
		manualStart.addEventListener("click", () => {
			stepper(bfsSteps);
		});
	} else if (algorithmType.classList.contains("bellman-ford")) {
		bellmanFord(startRow, startCol, endRow, endCol);
		manualStart.addEventListener("click", () => {
			stepper(bellmanSteps);
		});
	} else if (algorithmType.classList.contains("numIslands")) {
		if (islandAlgo === "bfs") {
			bfsIslands();
		} else if (islandAlgo === "dfs") {
			dfsIslands();
		}
	} else if (algorithmType.classList.contains("maxIsland")) {
		maxIsland();
	}
};
startBtn.addEventListener("click", startVisualization);

//Initialize board
window.onload = () => {
	gridContainer.addEventListener("mousedown", setWall);
	gridContainer.addEventListener("mouseup", setWall);
	gridContainer.addEventListener("mouseover", setWall);
	if (
		algorithmType.classList.contains("bfs") ||
		algorithmType.classList.contains("dfs") ||
		algorithmType.classList.contains("numIslands") ||
		algorithmType.classList.contains("maxIsland")
	) {
		createEmptyBoard();
	} else if (
		algorithmType.classList.contains("dijkstras") ||
		algorithmType.classList.contains("bellman-ford")
	) {
		createBoard();
	}
	if (
		algorithmType.classList.contains("bfs") ||
		algorithmType.classList.contains("dfs") ||
		algorithmType.classList.contains("dijkstras") ||
		algorithmType.classList.contains("bellman-ford")
	) {
		createStartNode(startRow, startCol);
		createEndNode(endRow, endCol);
	} else if (
		algorithmType.classList.contains("numIslands") ||
		algorithmType.classList.contains("maxIslands")
	) {
		if (islandAlgo === "bfs") {
			createStartNode(0, 0);
			createEndNode(19, 39);
			document
				.querySelector(`div[row='${0}'][col='${0}']`)
				.classList.add("islandsPathNode");
			document
				.querySelector(`div[row='${19}'][col='${39}']`)
				.classList.add("islandsPathNode");
		} else if (
			islandAlgo === "dfs" ||
			algorithmType.classList.contains("maxIslands")
		) {
			createStartNode(0, 0);
			createEndNode(0, 1);
			document
				.querySelector(`div[row='${0}'][col='${0}']`)
				.classList.add("islandsPathNode");
			document
				.querySelector(`div[row='${0}'][col='${1}']`)
				.classList.add("islandsPathNode");
		}
	}
};
