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

// get dom elements
const gridContainer = document.querySelector("#gridContainer");
const clearPathBtn = document.querySelector(".clearPath");
const resetBtn = document.querySelector(".reset");
const weightBtn = document.querySelector(".weight");
const algoBtn = document.querySelector(".algo");
const startBtn = document.querySelector(".start");
const wallBtn = document.querySelector(".setWalls");
const algorithmType = document.querySelector(".algorithm");

export var rowSize = 20;
export var colSize = 40;
export var startRow = 10;
export var startCol = 10;
export var endRow = 10;
export var endCol = 30;
export var mouseDown = false;
export var weightType = weightBtn.options[weightBtn.selectedIndex].value;
export var algorithm = algoBtn.options[algoBtn.selectedIndex].value;

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

const clearPath = () => {
	gridContainer.addEventListener("mousedown", setWall);
	gridContainer.addEventListener("mouseup", setWall);
	gridContainer.addEventListener("mouseover", setWall);
	if (weightType == "Unweighted") {
		refreshEmptyBoard();
	} else {
		refreshBoard();
	}
	startBtn.style.visibility = "visible";
};

resetBtn.addEventListener("click", () => location.reload());
clearPathBtn.addEventListener("click", clearPath);

const updateWeight = () => {
	weightType = weightBtn.options[weightBtn.selectedIndex].value;
	if (weightType == "Unweighted") {
		refreshEmptyBoard();
	} else {
		if (algorithm != "Dijkstras") {
			algoBtn.value = "dijkstras";
			algorithm = algoBtn.options[algoBtn.selectedIndex].value;
		}
		refreshBoard();
	}
	createStartNode(10, 10);
	createEndNode(10, 30);
};
weightBtn.addEventListener("change", updateWeight);

const updateAlgo = () => {
	algorithm = algoBtn.options[algoBtn.selectedIndex].value;
	if (algorithm != "Dijkstras") {
		weightBtn.value = "Unweighted";
		weightType = weightBtn.options[weightBtn.selectedIndex].value;
		refreshEmptyBoard();
	} else if (algorithm == "Dijkstras") {
		if (weightBtn.value == "Unweighted") {
			refreshEmptyBoard();
		} else {
			refreshBoard();
		}
	}
	createStartNode(10, 10);
	createEndNode(10, 30);
};
algoBtn.addEventListener("change", updateAlgo);

const startVisualization = () => {
	if (algorithmType.classList.contains("bfs")) {
		bfs(startRow, startCol, endRow, endCol);
	} else if (algorithmType.classList.contains("dfs")) {
		dfs(startRow, startCol, endRow, endCol);
	}
};
startBtn.addEventListener("click", startVisualization);

//Initialize board
window.onload = () => {
	gridContainer.addEventListener("mousedown", setWall);
	gridContainer.addEventListener("mouseup", setWall);
	gridContainer.addEventListener("mouseover", setWall);
	if (weightType == "Unweighted") {
		createEmptyBoard();
	} else {
		createBoard();
	}
	createStartNode(10, 10);
	createEndNode(10, 30);
};
