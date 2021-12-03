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
	if (!algorithmType.classList.contains("dijkstras")) {
		refreshEmptyBoard();
	} else {
		refreshBoard();
	}
	startBtn.style.visibility = "visible";
};

resetBtn.addEventListener("click", () => location.reload());
clearPathBtn.addEventListener("click", clearPath);

const startVisualization = () => {
	if (algorithmType.classList.contains("bfs")) {
		bfs(startRow, startCol, endRow, endCol);
	} else if (algorithmType.classList.contains("dfs")) {
		dfs(startRow, startCol, endRow, endCol);
	} else if (algorithmType.classList.contains("dijkstras")) {
		bfs(startRow, startCol, endRow, endCol);
	} else if (algorithmType.classList.contains("numIslands")) {
		if (islandAlgo === "bfs") {
			bfsIslands();
		} else if (islandAlgo === "dfs") {
			dfsIslands();
		}
	}
};
startBtn.addEventListener("click", startVisualization);

//Initialize board
window.onload = () => {
	gridContainer.addEventListener("mousedown", setWall);
	gridContainer.addEventListener("mouseup", setWall);
	gridContainer.addEventListener("mouseover", setWall);
	if (!algorithmType.classList.contains("dijkstras")) {
		createEmptyBoard();
	} else {
		createBoard();
	}
	if (
		algorithmType.classList.contains("bfs") ||
		algorithmType.classList.contains("dfs") ||
		algorithmType.classList.contains("dijkstras")
	) {
		createStartNode(startRow, startCol);
		createEndNode(endRow, endCol);
	} else if (algorithmType.classList.contains("numIslands")) {
		if (islandAlgo === "bfs") {
			createStartNode(0, 0);
			createEndNode(19, 39);
			document
				.querySelector(`div[row='${0}'][col='${0}']`)
				.classList.add("islandsPathNode");
			document
				.querySelector(`div[row='${19}'][col='${39}']`)
				.classList.add("islandsPathNode");
		} else if (islandAlgo === "dfs") {
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
