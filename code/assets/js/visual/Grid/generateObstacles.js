import { rowSize, colSize } from "./index.js";

const obstacles = (x = 0, y = 0) => {
	var node = document.querySelector(`div[row='${x}'][col='${y}']`);
	if (node.classList.contains("pathNode")) {
		return;
	} else {
		node.classList.toggle("wall");
		if (node.classList.contains("wall")) {
			node.setAttribute("wall", 1);
		} else {
			node.setAttribute("wall", 0);
		}
	}
};

export const setObstacles = () => {
	var obstacleSlider = document.querySelector(".obstacleSlider");
	obstacleSlider.setAttribute("max", rowSize + colSize);

	var rows = [];
	var cols = [];
	for (let i = 1; i < rowSize; i++) {
		rows.push(i);
	}
	for (let i = 1; i < colSize; i++) {
		cols.push(i);
	}
	var arr1 = rows.slice(),
		arr2 = cols.slice();

	arr1.sort(function () {
		return 0.5 - Math.random();
	});
	arr2.sort(function () {
		return 0.5 - Math.random();
	});

	var trimVal = Math.floor(
		(arr1.length * obstacleSlider.value) / (rowSize + colSize)
	);

	arr1.splice(0, arr1.length - trimVal);

	while (arr1.length) {
		var rowVal = arr1.pop(),
			colVal = arr2[0] == rowVal ? arr2.pop() : arr2.shift();
		obstacles(rowVal, colVal);
	}
};
