import { setWall } from "../Grid/createWalls.js";
import {
  rowSize,
  colSize,
  manualStart,
  dfsSteps,
  visitedPaths,
  startBtn,
  clearPathBtn,
  wallBtn,
  gridContainer,
  findNextPath,
} from "../Grid/index.js";
import { changeColor, checker } from "./dfs.js";

let speedSlider = document.querySelector(".speedSlider");
let time = speedSlider.value;
let bool = false;
let count = 1;

//traverse grid
const traverse = (node, visited, cost, endNode) => {
  let row = parseInt(node.getAttribute("row"));
  let col = parseInt(node.getAttribute("col"));
  if (bool || node == endNode) {
    bool = true;
    return;
  }

  let wall = parseInt(node.getAttribute("wall"));
  if (wall == 1) return;

  visited.push(node);
  visitedPaths.push([row, col]);
  dfsSteps.push([row, col, cost, row, col]);
  changeColor(node, cost);

  // Check all sides of a node
  let cr = row,
    cc = col;

  if (checker(cr + 1, cc)) {
    let child = document.querySelector(`div[row="${cr + 1}"][col="${cc}"]`);
    if (!visited.includes(child)) {
      traverse(child, visited, cost + 1, endNode);
      count++;
    } else {
      dfsSteps.push([row, col, cost, cr + 1, cc]);
    }
  }
  if (checker(cr, cc + 1)) {
    let child = document.querySelector(`div[row="${cr}"][col="${cc + 1}"]`);
    if (!visited.includes(child)) {
      traverse(child, visited, cost + 1, endNode);
      count++;
    } else {
      dfsSteps.push([row, col, cost, cr, cc + 1]);
    }
  }
  if (checker(cr - 1, cc)) {
    let child = document.querySelector(`div[row="${cr - 1}"][col="${cc}"]`);
    if (!visited.includes(child)) {
      traverse(child, visited, cost + 1, endNode);
      count++;
    } else {
      dfsSteps.push([row, col, cost, cr - 1, cc]);
    }
  }
  if (checker(cr, cc - 1)) {
    let child = document.querySelector(`div[row="${cr}"][col="${cc - 1}"]`);
    if (!visited.includes(child)) {
      traverse(child, visited, cost + 1, endNode);
      count++;
    } else {
      dfsSteps.push([row, col, cost, cr, cc - 1]);
    }
  }
};

//depth first search algorithm
export const findPaths = (
  x1 = 0,
  y1 = 0,
  x2 = rowSize - 1,
  y2 = colSize - 1
) => {
  time = speedSlider.value;
  time = 40 + (time - 1) * -2;
  gridContainer.removeEventListener("mousedown", setWall);
  gridContainer.removeEventListener("mouseover", setWall);
  let startNode = document.querySelector(`div[row='${x1}'][col='${y1}']`);
  let endNode = document.querySelector(`div[row='${x2}'][col='${y2}']`);

  //disable start and clear path buttons
  startBtn.setAttribute("disabled", "true");
  clearPathBtn.setAttribute("disabled", "true");
  wallBtn.setAttribute("disabled", "true");

  let visited = [];
  let cost = 1;
  bool = false;

  traverse(startNode, visited, cost, endNode);

  // re-enable disabled buttons
  setTimeout(() => {
    startBtn.removeAttribute("disabled");
    clearPathBtn.removeAttribute("disabled");
    manualStart.removeAttribute("disabled");
    findNextPath.removeAttribute("disabled");
    wallBtn.removeAttribute("disabled");
    console.log(visitedPaths);
  }, count * time + 100);
};
