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
import { bfsIslands } from "../NoIslands/bfsIslands.js";
import { dfsIslands } from "../NoIslands/dfsIslands.js";
import { maxIsland } from "../NoIslands/largeIsland.js";

// get dom elements
const gridContainer = document.querySelector("#gridContainer");
const clearPathBtn = document.querySelector(".clearPath");
const resetBtn = document.querySelector(".reset");
const weightBtn = document.querySelector(".weight");
const algoBtn = document.querySelector(".algo");
const startBtn = document.querySelector(".start");
const wallBtn = document.querySelector(".setWalls");
const islandAlgoBtn = document.querySelector(".islandsAlgo");
export const algorithmType = document.querySelector(".algorithm");

export var rowSize = 20;
export var colSize = 40;
export var startRow = 4;
export var startCol = 5;
export var endRow = 15;
export var endCol = 32;
export var startIslandRow = 4;
export var startIslandCol = 5;
export var endIslandRow = 15;
export var endIslandCol = 32;
export var mouseDown = false;
export var weightType = weightBtn.options[weightBtn.selectedIndex].value;
export var algorithm = algoBtn.options[algoBtn.selectedIndex].value;
export var islandAlgo =
	islandAlgoBtn.options[islandAlgoBtn.selectedIndex].value;

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
	if (
		algorithmType.classList.contains("bfs") ||
		algorithmType.classList.contains("dfs")
	) {
		createStartNode(startRow, startCol);
		createEndNode(endRow, endCol);
	}
};
weightBtn.addEventListener("change", updateWeight);

const startVisualization = () => {
	if (algorithmType.classList.contains("bfs")) {
		bfs(startRow, startCol, endRow, endCol);
	} else if (algorithmType.classList.contains("dfs")) {
		dfs(startRow, startCol, endRow, endCol);
	} else if (
		algorithmType.classList.contains("numIslands") ||
		algorithmType.classList.contains("maxIslands")
	) {
		if (islandAlgo === "bfs") {
			bfsIslands();
		} else if (islandAlgo === "dfs") {
			dfsIslands();
		} else if (algorithmType.classList.contains("maxIslands")) {
			maxIsland();
		}
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
	if (
		algorithmType.classList.contains("bfs") ||
		algorithmType.classList.contains("dfs")
	) {
		createStartNode(startRow, startCol);
		createEndNode(endRow, endCol);
	} else if (
		algorithmType.classList.contains("numIslands") ||
		algorithmType.classList.contains("maxIslands")
	) {
		if (islandAlgo === "bfs" || islandAlgo === "bfsMaxIslands") {
			createStartNode(0, 0);
			createEndNode(19, 39);
		} else if (islandAlgo === "dfs" || islandAlgo === "dfsMaxIslands") {
			createStartNode(0, 0);
			createEndNode(0, 1);
		}
	}
};
