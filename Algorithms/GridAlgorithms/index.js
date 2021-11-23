import {
	createEmptyBoard,
	createBoard,
	createStartNode,
	createEndNode,
	refreshBoard,
	refreshEmptyBoard,
} from "./createGrid.js";
import { setWall } from "./createWalls.js";
import { bfs } from "../PathFindingAlgorithms/bfs.js";

// get dom elements
var gridContainer = document.querySelector("#gridContainer");
var refreshBtn = document.querySelector(".refresh");
var resetBtn = document.querySelector(".reset");
var weightBtn = document.querySelector(".weight");
var algoBtn = document.querySelector(".algo");
var startBtn = document.querySelector(".start");

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

const refresh = () => {
	gridContainer.addEventListener("mousedown", setWall);
	gridContainer.addEventListener("mouseup", setWall);
	gridContainer.addEventListener("mouseover", setWall);
	if (weightType == "Unweighted") {
		refreshEmptyBoard();
	} else {
		refreshBoard();
	}
	startBtn.style.visibilifty = "visible";
};

const reset = () => {
	location.reload();
};

resetBtn.addEventListener("click", reset);
refreshBtn.addEventListener("click", refresh);

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
		if (weightBtn.valu == "Unweighted") {
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
	console.log(algorithm);
	if (algorithm === "bfs") {
		bfs(startRow, startCol, endRow, endCol);
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
