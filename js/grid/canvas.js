//     createCanvas() {
//         const { ctx, grid, selectCol, selectRow } = this;  // Destructure grid and context
//         const { cellWidth, cellHeight, dataset } = grid;  // Destructure cell width, height, and dataset

//         // console.log("data:", dataset);

//         // Draw cells within a canvas block
//         for (let r = 0; r < grid.rowsPerCanvas; r++) {
//             for (let c = 0; c < grid.colsPerCanvas; c++) {
//                 // Calculate the global row and column index for data mapping
//                 const globalRow = this.yIndex * grid.rowsPerCanvas + r;
//                 const globalCol = this.xIndex * grid.colsPerCanvas + c;

//                 // Calculate the X and Y position for the current cell
//                 const x = Math.floor(c * cellWidth);
//                 const y = Math.floor(r * cellHeight);

//                 if (selectRow === null && selectCol === globalCol + 1) {
//                     // console.log("selectCol", selectCol, "globalCol", globalCol);
//                     if (globalRow !== 0) {
//                         ctx.fillStyle = "#caead8";
//                         ctx.fillRect(x, y, cellWidth, cellHeight);
//                     }

//                     // Draw top line
//                     ctx.beginPath();
//                     ctx.strokeStyle = "rgba(33, 62, 64, 0.1)";
//                     ctx.moveTo(x, y + 0.5);
//                     ctx.lineTo(x + cellWidth, y + 0.5);
//                     ctx.stroke();

//                     // Draw left line
//                     ctx.beginPath();
//                     ctx.strokeStyle = "#107c41";
//                     ctx.moveTo(x + 0.5, y);
//                     ctx.lineTo(x + 0.5, y + cellHeight);
//                     ctx.stroke();

//                     // Draw right line
//                     ctx.beginPath();
//                     ctx.strokeStyle = "#107c41";
//                     ctx.moveTo(x + cellWidth + 0.5, y);
//                     ctx.lineTo(x + cellWidth + 0.5, y + cellHeight);
//                     ctx.stroke();
//                 } else if (selectCol === null && selectRow === globalRow + 1) {
//                     // console.log("selectRow", selectRow, "globalRow", globalRow);
//                     if (globalCol !== 0) {
//                         ctx.fillStyle = "#caead8";
//                         ctx.fillRect(x, y, cellWidth, cellHeight);
//                     }
//                     // Draw top line
//                     ctx.beginPath();
//                     ctx.strokeStyle = "#107c41";
//                     ctx.moveTo(x, y + 0.5);
//                     ctx.lineTo(x + cellWidth, y + 0.5);
//                     ctx.stroke();

//                     // Draw top line
//                     ctx.beginPath();
//                     ctx.strokeStyle = "#107c41";
//                     ctx.moveTo(x, y + cellHeight + 0.5);
//                     ctx.lineTo(x + cellWidth, y + cellHeight + 0.5);
//                     ctx.stroke();

//                     // Draw right line
//                     ctx.beginPath();
//                     ctx.strokeStyle = "rgba(33, 62, 64, 0.3)";
//                     ctx.moveTo(x + cellWidth + 0.3, y);
//                     ctx.lineTo(x + cellWidth + 0.3, y + cellHeight);
//                     ctx.stroke();
//                 } else {
//                     // Draw top line
//                     ctx.beginPath();
//                     ctx.strokeStyle = "rgba(33, 62, 64, 0.1)";
//                     ctx.moveTo(x, y + 0.5);
//                     ctx.lineTo(x + cellWidth, y + 0.5);
//                     ctx.stroke();

//                     // Draw right line
//                     ctx.beginPath();
//                     ctx.strokeStyle = "rgba(33, 62, 64, 0.1)";
//                     ctx.moveTo(x + cellWidth + 0.5, y);
//                     ctx.lineTo(x + cellWidth + 0.5, y + cellHeight);
//                     ctx.stroke();
//                 }
//                 // Draw cell data for all rows (including header)
//                 if (dataset.length > 0) {
//                     let cellData = "";
//                     // Get the Row object for the globalRow
//                     const row = dataset[globalRow];

//                     // Check if the Row and Cell exist, then fetch the cell value
//                     if (row && typeof row.getCell === "function") {
//                         const cell = row.getCell(globalCol);
//                         if (cell && typeof cell.getValue === "function") {
//                             cellData = cell.getValue();
//                             // console.log(globalRow, globalCol, cellData);
//                         }
//                     }

//                     // Set text style (bold for header row)
//                     ctx.fillStyle = "#000";
//                     ctx.font = (globalRow === 0) ? "bold 14px Arial" : "14px Arial";
//                     ctx.textBaseline = "middle";
//                     if (Number(cellData)) {
//                         ctx.textAlign = "left";
//                     } else {
//                         ctx.textAlign = "left";
//                     }

//                     // Limit text to 8 characters and render it
//                     const text = (globalRow === 0)
//                         ? String(cellData).toUpperCase().slice(0, 8)
//                         : String(cellData).slice(0, 8);

//                     // Draw the text inside the cell
//                     ctx.fillText(text, x + 4, y + cellHeight / 2);
//                 }
//             }
//         }
//     }


// Class for creating a single canvas block
export class Canvas {
    /**
     * Constructor for the Canvas instance
     * @param {*} grid - Reference to the Grid instance
     * @param {*} xIndex - The x-index (column) for the canvas block
     * @param {*} yIndex - The y-index (row) for the canvas block
     */
    constructor(grid, xIndex, yIndex, selectCol, selectRow) {
        this.grid = grid;
        this.xIndex = xIndex;
        this.yIndex = yIndex;
        this.selectCol = selectCol || null;
        this.selectRow = selectRow || null;

        const { colWidths, rowHeights, colsPerCanvas, rowsPerCanvas } = grid;

        // Calculate dynamic width
        let width = 0;
        for (let c = 0; c < colsPerCanvas; c++) {
            width += colWidths[xIndex * colsPerCanvas + c] || 0;
        }
        // Calculate dynamic height
        let height = 0;
        for (let r = 0; r < rowsPerCanvas; r++) {
            height += rowHeights[yIndex * rowsPerCanvas + r] || 0;
        }
        // console.log("globalCol", globalCol, "globalRow", globalRow);
        // Create the canvas element
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.setAttribute("class", "canvas-div");

        this.canvas.width = width;
        this.canvas.height = height;

        // Calculate position offsets
        let leftOffset = grid.colWidths[0]; // Space for row header
        for (let i = 0; i < xIndex * colsPerCanvas; i++) {
            leftOffset += colWidths[i] || 0;
        }

        let topOffset = grid.rowHeights[0]; // Space for column header
        for (let i = 0; i < yIndex * rowsPerCanvas; i++) {
            topOffset += rowHeights[i] || 0;
        }

        this.canvas.style.position = "absolute";
        this.canvas.style.left = `${leftOffset}px`;
        this.canvas.style.top = `${topOffset}px`;

        // Append the canvas element to the wrapper
        grid.wrapper.appendChild(this.canvas);

        // Initialize canvas by drawing the grid cells and content
        this.createCanvas();
    }
    /**
     * Method to create and render the canvas cells
     */
    createCanvas() {
        const { ctx, grid, selectCol, selectRow } = this;  // Destructure grid and context
        const { dataset, rowsPerCanvas, colsPerCanvas, colWidths, rowHeights } = grid;  // Destructure cell width, height, and dataset
        // ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const startRow = this.yIndex * rowsPerCanvas;
        const startCol = this.xIndex * colsPerCanvas;

        // Draw cells within a canvas block
        let y = 0;
        for (let r = 0; r < rowsPerCanvas; r++) {
            let rowHeight = rowHeights[startRow + r];
            let x = 0;
            for (let c = 0; c < colsPerCanvas; c++) {
                // Calculate the global row and column index for data mapping
                let colWidth = colWidths[startCol + c];
                const globalRow = startRow + r;
                const globalCol = startCol + c;

                const isColSelected = selectRow === null && selectCol === globalCol + 1;
                const isRowSelected = selectCol === null && selectRow === globalRow + 1;

                if (isColSelected || isRowSelected) {
                    ctx.fillStyle = "#caead8";
                    ctx.fillRect(x, y, colWidth, rowHeight);
                }

                // Get the Row object for the globalRow
                const rowMap = dataset.get(globalRow);
                let cellData = rowMap instanceof Map ? rowMap.get(globalCol) || "" : "";

                ctx.fillStyle = "#000";
                ctx.font = globalRow === 0 ? "bold 14px Arial" : "14px Arial";
                ctx.textBaseline = "middle";
                ctx.textAlign = Number(cellData) ? "right" : "left";
                const text = globalRow === 0 ? String(cellData).slice(0, 8).toUpperCase() : String(cellData).slice(0, 8);
                const textX = Number(cellData) ? x + colWidth - 5 : x + 4;
                ctx.fillText(text, textX, y + rowHeight / 2);

                x += colWidth;
            }
            y += rowHeight;
        }

        // Horizontal lines
        y = 0;
        for (let r = 0; r <= rowsPerCanvas; r++) {
            ctx.beginPath();
            const globalRowIndex = r + startRow;
            ctx.strokeStyle = (selectCol === null && selectRow !== null &&
                (selectRow === globalRowIndex || selectRow === globalRowIndex + 1))
                ? "#107c41" : "rgba(33, 62, 64, 0.1)";
            ctx.moveTo(0, y + 0.5);
            ctx.lineTo(this.canvas.width, y + 0.5);
            ctx.stroke();
            y += rowHeights[startRow + r] || 0;
        }

        // Vertical lines
        let x = 0;
        for (let c = 0; c <= colsPerCanvas; c++) {
            ctx.beginPath();
            const globalColIndex = c + startCol;
            ctx.strokeStyle = (selectCol !== null && selectRow === null &&
                (selectCol === globalColIndex || selectCol === globalColIndex + 1))
                ? "#107c41" : "rgba(33, 62, 64, 0.1)";
            ctx.moveTo(x + 0.5, 0);
            ctx.lineTo(x + 0.5, this.canvas.height);
            ctx.stroke();
            x += colWidths[startCol + c] || 0;
        }
    }
    /**
     * Method to remove the canvas element from the DOM 
     */
    removeCanvas() {
        this.canvas.remove();
    }
}