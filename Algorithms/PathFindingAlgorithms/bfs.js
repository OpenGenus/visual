import { rowSize, colSize, weightType } from "../GridAlgorithms/index.js";
import { setWall } from "../GridAlgorithms/createWalls.js";

const gridContainer = document.querySelector("#gridContainer");
var time = 20;

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
		var node = document.querySelector(`div[row="${row}"][col="${col}"]`);
		let wall = parseInt(node.getAttribute("wall"));
		if (wall == 1) return;
		let prow = parseInt(curr.getAttribute("row"));
		let pcol = parseInt(curr.getAttribute("col"));
		if (weightType == "weighted") {
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
			}
			visited.push(node);
			return node;
		}
	} else {
		return false;
	}
};

//algorithm implementation - bfs for unweighted, dijkstras for weighted
export const bfs = (x1 = 0, y1 = 0, x2 = rowSize - 1, y2 = colSize - 1) => {
	// time = slider.value;
	time = 40 + (time - 1) * -2;
	gridContainer.removeEventListener("mousedown", setWall);
	gridContainer.removeEventListener("mouseover", setWall);
	var startNode = document.querySelector(`div[row='${x1}'][col='${y1}']`);
	var endNode = document.querySelector(`div[row='${x2}'][col='${y2}']`);

	//disable start and refresh btn
	var startBtn = document.querySelector(".start");
	startBtn.style.visibility = "hidden";
	var refreshBtn = document.querySelector(".refresh");
	refreshBtn.style.visibility = "hidden";

	//start algorithm
	var visited = [startNode];
	var checker = [startNode];
	var count = 1;

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
		if (weightType == "Unweighted" && row == x2 && col == y2) break;
		let wall = parseInt(curr.getAttribute("wall"));
		if (wall == 1) continue;

		//check 4 sides of node
		let nextRow = row + 1;
		let prevRow = row - 1;
		let leftCol = col - 1;
		let rightCol = col + 1;
		let a = checkUpdateNode(nextRow, col, curr, checker, visited, count);
		let b = checkUpdateNode(prevRow, col, curr, checker, visited, count);
		let c = checkUpdateNode(row, leftCol, curr, checker, visited, count);
		let d = checkUpdateNode(row, rightCol, curr, checker, visited, count);
		count++;
	}

	//draw route
	setTimeout(() => {
		startNode.setAttribute("class", "pathNode");
		while (endNode.getAttribute("parent") != "null") {
			endNode.setAttribute("class", "chosenPath");
			var coor = endNode.getAttribute("parent").split("|");
			var prow = parseInt(coor[0]);
			var pcol = parseInt(coor[1]);
			endNode = document.querySelector(
				`div[row="${prow}"][col="${pcol}"]`
			);
		}
		endNode = document.querySelector(`div[row="${x2}"][col="${y2}`);
		endNode.setAttribute("class", "pathNode");
	}, count * time + 100);

	setTimeout(() => {
		refreshBtn.style.visibility = "visible";
	}, count * time + 100);
};
