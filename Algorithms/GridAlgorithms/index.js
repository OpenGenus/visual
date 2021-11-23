import {
	createEmptyBoard,
	createBoard,
	createStartNode,
	createEndNode,
} from "./createGrid.js";

export var rowSize = 20;
export var colSize = 40;
export var startRow = 10;
export var endRow = 10;
export var startCol = 10;
export var endCol = 30;
export var mouseDown = false;

var gridContainer = document.querySelector("#gridContainer");

//event listeners
gridContainer.addEventListener("mousedown", () => {
	mouseDown = true;
});
gridContainer.addEventListener("mouseup", () => {
	mouseDown = false;
});
//Initialize board
window.onload = () => {
	createEmptyBoard();
	createStartNode(10, 10);
	createEndNode(10, 30);
};
