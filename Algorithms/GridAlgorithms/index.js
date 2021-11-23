import {
	createEmptyBoard,
	createBoard,
	createStartNode,
	createEndNode,
	refreshBoard,
	refreshEmptyBoard,
} from "./createGrid.js";
import { setWall } from "./createWalls.js";

export var rowSize = 20;
export var colSize = 40;
export var startRow = 10;
export var endRow = 10;
export var startCol = 10;
export var endCol = 30;
export var mouseDown = false;

// get dom elements
var gridContainer = document.querySelector("#gridContainer");
var refreshBtn = document.querySelector(".refresh");
var resetBtn = document.querySelector(".reset");

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
	refreshBoard();
};

const reset = () => {
	location.reload();
};

resetBtn.addEventListener("click", reset);
refreshBtn.addEventListener("click", refresh);

//Initialize board
window.onload = () => {
	gridContainer.addEventListener("mousedown", setWall);
	gridContainer.addEventListener("mouseup", setWall);
	gridContainer.addEventListener("mouseover", setWall);
	createEmptyBoard();
	createStartNode(10, 10);
	createEndNode(10, 30);
};
