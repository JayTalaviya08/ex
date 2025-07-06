import { Grid } from "./grid/grid.js";
import { generateData } from "./data.js";
import { GridResizeHandler } from "./grid/resize.js";

const wrapper = document.getElementById("wrapper-div");
const cellNum = document.querySelector(".cellNum");
const cellValue = document.querySelector(".cellValue");

// Controls how many cells per canvas
const rowsPerCanvas = 50;
const colsPerCanvas = 26;

const cellWidth = 80;
const cellHeight = 25;

// Max row & col limits
const maxRows = 100000;
const maxCols = 500;

// Generate dataset for the grid
const myData = generateData(100000);

// Initializing grid
const grid = new Grid(wrapper, cellNum, cellValue, rowsPerCanvas, colsPerCanvas, cellWidth, cellHeight, maxRows, maxCols, myData);

// Add resize handler
new GridResizeHandler(grid);

