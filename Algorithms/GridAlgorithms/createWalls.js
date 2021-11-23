import { startRow, endRow, startCol, endCol, mouseDown } from "./index.js";

export const setWall = (e) => {
	if (mouseDown) {
		if (e.target.classList.contains("beforeStart")) {
			const row = e.target.getAttribute("row");
			const col = e.target.getAttribute("col");
			if (
				(row == startRow && col == startCol) ||
				(endRow == row && endCol == col)
			) {
				window.alert("Make wall inside the grid");
			} else {
				e.target.classList.toggle("wall");
				if (e.target.classList.conatins("wall")) {
					e.target.setAttribute("wall", 1);
				} else {
					e.target.setAttribute("wall", 0);
				}
			}
		}
	}
};
