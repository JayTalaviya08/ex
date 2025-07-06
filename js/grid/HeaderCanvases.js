// Function to create and append the top-left sticky corner, horizontal, and vertical canvases
export function topDiv(grid) {
    const wrapper = grid.wrapper;

    //  Top-left corner 
    const topDiv = document.createElement("div"); // Create top-left div 
    topDiv.style.position = "sticky";
    topDiv.style.top = "0";
    topDiv.style.left = "0";
    topDiv.style.backgroundColor = "#f5f5f5";
    topDiv.style.borderRight = "2px solid #bdbdbd";
    topDiv.style.borderBottom = "2px solid #bdbdbd";
    topDiv.style.zIndex = "100000";
    topDiv.style.width = `${grid.colWidths[0] - 2}px`;
    topDiv.style.height = `${grid.rowHeights[0] - 2}px`;
    topDiv.style.cursor = `cell`;

    const topRect = document.createElement("div");
    topRect.setAttribute("class", "top-rect");
    topDiv.appendChild(topRect);
    wrapper.appendChild(topDiv); // Append the created topDiv to the grid wrapper
}

// Class for creating the horizontal canvas (column headers)
export class HorizontalCanvas {
        /**
     * Constructor for the HorizontalCanvas instance
     * @param {*} grid - Reference to the Grid instance
     * @param {*} xIndex - The x-index (column) for the canvas block
     * @param {*} yIndex - The y-index (row) for the canvas block
     */
  constructor(grid, xIndex, yIndex, globalCol, globalRow) {
    // Store grid reference and indexes for canvas positioning
    this.grid      = grid;
    this.xIndex    = xIndex;
    this.yIndex    = yIndex;
    this.globalCol = globalCol;
    this.globalRow = globalRow;

    const { colWidths, colsPerCanvas, rowHeights } = grid;

    // compute tile width
    let tileW = 0;
    for (let c = 0; c < colsPerCanvas; c++) {
      tileW += colWidths[xIndex * colsPerCanvas + c] || 0;
    }

    // make the canvas
    this.canvas = document.createElement("canvas");
    this.ctx    = this.canvas.getContext("2d");
    this.canvas.width  = tileW;
    this.canvas.height = rowHeights[0];
    this.canvas.style.position = "absolute";
    this.canvas.style.top      = "0";
    this.canvas.style.zIndex   = "1000";
    this.canvas.style.cursor   = "col-resize";

    // mark it for resize‐hit
    this.canvas.classList.add("h-canvas");
    this.canvas.dataset.xIndex = xIndex;
    this.canvas.dataset.yIndex = yIndex;

    // correct left offset: row-header width + all preceding data-col widths
    let leftOffset = grid.colWidths[0];
    for (let i = 0; i < xIndex * colsPerCanvas; i++) {
      leftOffset += colWidths[i] || 0;
    }
    this.canvas.style.left = `${leftOffset}px`;

        // Append the canvas element to the wrapper
        grid.wrapper.appendChild(this.canvas);

        // Initial drawing of the horizontal header
        this.createHCanvas();
  }

    /**
     * Method to create and render the horizontal header
     */
  createHCanvas() {
    const { ctx, grid, xIndex, globalCol, globalRow } = this;
    const { colWidths, colsPerCanvas, rowHeights }   = grid;
    const headerH = rowHeights[0];
    const startCol = xIndex * colsPerCanvas;

    // ctx.clearRect(0, 0, this.canvas.width, headerH);
    console.log(globalCol, globalRow);

    // Draw the horizontal header columns (A, B, C, ...)
    let x = 0;
    for (let c = 0; c < colsPerCanvas; c++) {
      const colIdx = startCol + c;
      const w      = colWidths[colIdx];
      const sel    = globalCol === colIdx + 1 && globalRow == null;
// Background
      ctx.fillStyle = sel ? "#107c41" : "#f5f5f5";
      ctx.fillRect(x, 0, w, headerH);

                  if (((c + 1) + (xIndex * colsPerCanvas)) === globalCol && globalRow !== null) {
                // console.log((globalCol % 26), c);
                ctx.fillStyle = "#caead8";
                ctx.fillRect(x, 0, w, headerH);

                // Draw bottom line
                ctx.beginPath();
                ctx.strokeStyle = "#107c41";
                ctx.lineWidth = 5;
                ctx.moveTo(x, headerH + 0.5);
                ctx.lineTo(x + w, headerH + 0.5);
                ctx.stroke();
                ctx.lineWidth = 0.5;
            }

      // label A, B, C...
      let label = "", idx = colIdx + 1;
      while (idx > 0) {
        label = String.fromCharCode(((idx - 1) % 26) + 65) + label;
        idx   = Math.floor((idx - 1) / 26);
      }
      ctx.fillStyle    = sel ? "#fff" : "#333";
      ctx.font         = sel ? "bold 11pt Segoe UI" : "11pt Segoe UI";
      ctx.textAlign    = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, x + w/2, headerH/2);

      x += w;
    }

    // draw the vertical grid lines
    ctx.beginPath();
    ctx.strokeStyle = "rgba(33,62,64,0.2)";
    x = 0;
    for (let c = 0; c <= colsPerCanvas; c++) {
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, headerH);
      x += colWidths[startCol + c] || 0;
    }
    ctx.stroke();
  }
    /**
    * Method to remove the horizontal canvas from the DOM
    */
  removeCanvas() {
    this.canvas.remove();
  }
}

export class VerticalCanvas {
  constructor(grid, xIndex, yIndex, globalCol, globalRow) {
    this.grid      = grid;
    this.xIndex    = xIndex;
    this.yIndex    = yIndex;
        this.globalCol = globalCol || null;
        this.globalRow = globalRow || null;

    const { rowHeights, rowsPerCanvas, colWidths } = grid;

    // compute dynamic canvas height
    let height = 0;
    for (let r = 0; r < rowsPerCanvas; r++) {
      height += rowHeights[yIndex * rowsPerCanvas + r] || 0;
    }

    // make the canvas
    this.canvas = document.createElement("canvas");
    this.ctx    = this.canvas.getContext("2d");
    this.canvas.width  = colWidths[0];
    this.canvas.height = height;
    this.canvas.style.position = "absolute";
    this.canvas.style.left     = "0";
    this.canvas.style.zIndex   = "1000";
    this.canvas.style.cursor   = "row-resize";

    // mark it for resize‐hit
    this.canvas.classList.add("v-canvas");
    this.canvas.dataset.xIndex = xIndex;
    this.canvas.dataset.yIndex = yIndex;

    // correct top offset: col-header height + all preceding data-row heights
    let topOffset = rowHeights[0];
    for (let i = 0; i < yIndex * rowsPerCanvas; i++) {
      topOffset += rowHeights[i] || 0;
    }
    this.canvas.style.top = `${topOffset}px`;

    grid.wrapper.appendChild(this.canvas);
    this.createVCanvas();
  }

  createVCanvas() {
    const { ctx, grid, yIndex, globalCol, globalRow } = this;
    const { rowHeights, rowsPerCanvas, colWidths }    = grid;
    const headerW = colWidths[0];
    const startRow = yIndex * rowsPerCanvas;

    ctx.clearRect(0, 0, headerW, this.canvas.height);

    let y = 0;
    for (let r = 0; r < rowsPerCanvas; r++) {
      const rowIdx = startRow + r;
      const h      = rowHeights[rowIdx];
      const sel    = globalRow === rowIdx + 1 && globalCol == null;
      // Background
      ctx.fillStyle = sel ? "#107c41" : "#f5f5f5";
      ctx.fillRect(0, y, headerW, h);

        // Special case for mixed selection
        if ((rowIdx + 1 === globalRow) && globalCol !== null) {
            ctx.fillStyle = "#caead8";
            ctx.fillRect(0, y, headerW, h);

            ctx.beginPath();
            ctx.strokeStyle = "#107c41";
            ctx.lineWidth = 5;
            ctx.moveTo(headerW + 0.5, y);
            ctx.lineTo(headerW + 0.5, y + h);
            ctx.stroke();
            ctx.lineWidth = 1;
        }

      ctx.fillStyle    = sel ? "#fff" : "#333";
      ctx.font         = sel ? "bold 11pt Segoe UI" : "11pt Segoe UI";
      ctx.textAlign    = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(rowIdx + 1, headerW - 5, y + h/2);

      y += h;
    }

    // draw the horizontal grid lines
    ctx.beginPath();
    ctx.strokeStyle = "rgba(33,62,64,0.2)";
    y = 0;
    for (let r = 0; r <= rowsPerCanvas; r++) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(headerW, y + 0.5);
      y += rowHeights[startRow + r] || 0;
    }
    ctx.stroke();
  }
    /**
    * Method to remove the vertical canvas from the DOM
    */
  removeCanvas() {
    this.canvas.remove();
  }
}


// Class for creating the horizontal canvas (column headers) 
// export class HorizontalCanvas {
//     /**
//      * Constructor for the HorizontalCanvas instance
//      * @param {*} grid - Reference to the Grid instance
//      * @param {*} xIndex - The x-index (column) for the canvas block
//      * @param {*} yIndex - The y-index (row) for the canvas block
//      */
//     constructor(grid, xIndex, yIndex, globalCol, globalRow) {
//         // Store grid reference and indexes for canvas positioning
//         this.grid = grid;
//         this.xIndex = xIndex;
//         this.yIndex = yIndex;
//         this.globalCol = globalCol || null;
//         this.globalRow = globalRow || null;
//         this.canvas = document.createElement("canvas");
//         this.ctx = this.canvas.getContext("2d");

//         this.canvas.width = grid.colsPerCanvas * grid.cellWidth;
//         // `${window.innerWidth - grid.cellWidth}`;
//         this.canvas.height = grid.cellHeight;

//         // Set up the canvas styles
//         this.canvas.style.position = "absolute";
//         this.canvas.style.top = "0";
//         this.canvas.style.left = `${this.xIndex * this.canvas.width + grid.cellWidth}px`;
//         this.canvas.style.zIndex = "1000";
//         this.canvas.style.cursor = "col-resize";

//         // Append the canvas element to the wrapper
//         grid.wrapper.appendChild(this.canvas);

//         // Initial drawing of the horizontal header
//         this.createHCanvas();
//     }
// createHCanvas() {
//     const { ctx, grid, globalCol, globalRow } = this;
//     const { cellWidth, cellHeight } = grid;

//     // Draw the horizontal header columns (A, B, C, ...)
//     for (let c = 0; c < grid.colsPerCanvas; c++) {
//         // Calculate the X and Y position for the current cell
//         const x = c * cellWidth;
//         const y = 0;

//         // Draw the header cell
//         if (((c + 1) + (this.xIndex * grid.colsPerCanvas)) === globalCol && globalRow === null) {
//             ctx.fillStyle = "#107c41";
//             ctx.fillRect(x, y, cellWidth, cellHeight);
//         } else if (globalRow !== null && globalCol === null) {
//             ctx.fillStyle = "#caead8";
//             ctx.fillRect(x, y, cellWidth, cellHeight);

//             // Draw right line
//             ctx.beginPath();
//             ctx.strokeStyle = "#107c41";
//             ctx.moveTo(x + cellWidth, y + 2);
//             ctx.lineTo(x + cellWidth, y + cellHeight + 2);
//             ctx.stroke();

//             // Draw bottom line
//             ctx.beginPath();
//             ctx.strokeStyle = "#107c41";
//             ctx.lineWidth = 5;
//             ctx.moveTo(x, y + cellHeight + 0.5);
//             ctx.lineTo(x + cellWidth, y + cellHeight + 0.5);
//             ctx.stroke();
//             ctx.lineWidth = 0.5;
//         }
//         else if (((c + 1) + (this.xIndex * grid.colsPerCanvas)) === globalCol) {
//             // console.log((globalCol % 26), c);
//             ctx.fillStyle = "#caead8";
//             ctx.fillRect(x, y, cellWidth, cellHeight);

//             // Draw bottom line
//             ctx.beginPath();
//             ctx.strokeStyle = "#107c41";
//             ctx.lineWidth = 5;
//             ctx.moveTo(x, y + cellHeight + 0.5);
//             ctx.lineTo(x + cellWidth, y + cellHeight + 0.5);
//             ctx.stroke();
//             ctx.lineWidth = 0.5;
//         } else {
//             ctx.fillStyle = "#f5f5f5";
//             ctx.fillRect(x, y, cellWidth, cellHeight);

//             // Draw right line
//             ctx.beginPath();
//             ctx.strokeStyle = "rgba(33, 62, 64, 0.2)";
//             ctx.moveTo(x + cellWidth, y + 2);
//             ctx.lineTo(x + cellWidth, y + cellHeight + 2);
//             ctx.stroke();
//         }

//         // Generate the label for the column header (A, B, C, ...)
//         let label = "", index = c + 1 + (this.xIndex * grid.colsPerCanvas);
//         // console.log(index);

//         while (index > 0) {
//             label = String.fromCharCode(((index - 1) % 26) + 65) + label;
//             index = Math.floor((index - 1) / 26);
//         }

//         // Draw the label in the center of each header cell
//         if (globalRow !== null && globalCol === null) {
//             ctx.fillStyle = "#107c41";
//         } else {
//             ctx.fillStyle = c + 1 === (globalCol % grid.colsPerCanvas) && globalRow === null ? "#fff" : "#333";
//         }
//         if (globalRow !== null && globalCol === null) {
//             ctx.font = "bold 11pt Segoe UI, sans-serif";
//         } else {
//             ctx.font = c + 1 === (globalCol % grid.colsPerCanvas) && globalRow === null ? "bold 11pt Segoe UI, sans-serif" : "11pt Segoe UI, sans-serif";
//         }
//         ctx.textAlign = "center";
//         ctx.textBaseline = "middle";
//         ctx.fillText(label, x + cellWidth / 2, cellHeight / 2);
//     }
// }

// // Class for creating the vertical canvas (row headers)
// export class VerticalCanvas {
//     /**
//      * Constructor for the HorizontalCanvas instance
//      * @param {*} grid - Reference to the Grid instance
//      */
//     constructor(grid, xIndex, yIndex, globalCol, globalRow) {
//         // Store grid reference and indexes for canvas positioning
//         this.grid = grid;
//         this.xIndex = xIndex;
//         this.yIndex = yIndex;
//         this.globalCol = globalCol || null;
//         this.globalRow = globalRow || null;

//         this.canvas = document.createElement("canvas");
//         this.ctx = this.canvas.getContext("2d");

//         this.canvas.width = grid.cellWidth;
//         this.canvas.height = grid.rowsPerCanvas * grid.cellHeight;
//         // `${this.clientHeight - grid.cellHeight}`;

//         this.canvas.style.position = "absolute";
//         this.canvas.style.top = `${this.yIndex * this.canvas.height + grid.cellHeight}px`;
//         // console.log(yIndex * this.canvas.height + grid.cellHeight);
//         this.canvas.style.left = "0";
//         this.canvas.style.zIndex = "1000";
//         this.canvas.style.cursor = "row-resize";

//         // Append the canvas element to the wrapper
//         grid.wrapper.appendChild(this.canvas);

//         // Initial drawing of the vertical header
//         this.createVCanvas();
//     }
//     /**
//      * Method to create and render the horizontal header
//      */
//     // createVCanvas() {
//     //     const { ctx, grid, globalCol, globalRow } = this;

//     //     // Draw the vertical header rows (1, 2, 3, ...)
//     //     for (let r = 0; r < grid.rowsPerCanvas; r++) {
//     //         // Calculate the X and Y position for the current cell
//     //         const y = r * grid.cellHeight;
//     //         const x = 0;

//     //         // console.log(((r + 1) + (this.yIndex * grid.rowsPerCanvas)), globalRow);

//     //         // Draw the header cell
//     //         if (((r + 1) + (this.yIndex * grid.rowsPerCanvas)) === globalRow && globalCol === null) {
//     //             ctx.fillStyle = "#107c41";
//     //             ctx.fillRect(x, y, grid.cellWidth, grid.cellHeight);
//     //         } else if (globalRow === null && globalCol !== null) {
//     //             ctx.fillStyle = "#caead8";
//     //             ctx.fillRect(x, y, grid.cellWidth, grid.cellHeight);

//     //             // Top line (except the first row)
//     //             ctx.beginPath();
//     //             ctx.strokeStyle = "#107c41";
//     //             // ctx.lineWidth = 0.5;
//     //             ctx.moveTo(x, y + 0.5);
//     //             ctx.lineTo(x + grid.cellWidth, y + 0.5);
//     //             ctx.stroke();

//     //             // Right line
//     //             ctx.beginPath();
//     //             ctx.strokeStyle = "#107c41";
//     //             ctx.lineWidth = 3;
//     //             ctx.moveTo(x + grid.cellWidth + 0.5, y);
//     //             ctx.lineTo(x + grid.cellWidth + 0.5, y + grid.cellHeight);
//     //             ctx.stroke();
//     //             ctx.lineWidth = 0.5;
//     //         }
//     //         else if (((r + 1) + (this.yIndex * grid.rowsPerCanvas)) === globalRow) {
//     //             // console.log((globalRow%50), r);
//     //             ctx.fillStyle = "#caead8";
//     //             ctx.fillRect(x, y, grid.cellWidth, grid.cellHeight);

//     //             // Right line
//     //             ctx.beginPath();
//     //             ctx.strokeStyle = "#107c41";
//     //             ctx.lineWidth = 5;
//     //             ctx.moveTo(x + grid.cellWidth + 0.5, y);
//     //             ctx.lineTo(x + grid.cellWidth + 0.5, y + grid.cellHeight);
//     //             ctx.stroke();
//     //             ctx.lineWidth = 1;

//     //         } else {
//     //             ctx.fillStyle = "#f5f5f5";
//     //             ctx.fillRect(x, y, grid.cellWidth, grid.cellHeight);

//     //             // Top line (except the first row)
//     //             ctx.beginPath();
//     //             ctx.strokeStyle = "rgba(33, 62, 64, 0.1)";
//     //             ctx.moveTo(x, y + 0.5);
//     //             ctx.lineTo(x + grid.cellWidth, y + 0.5);
//     //             ctx.stroke();

//     //             // Right line
//     //             ctx.beginPath();
//     //             ctx.strokeStyle = "rgba(33, 62, 64, 0.1)";
//     //             ctx.lineWidth = 1;
//     //             ctx.moveTo(x + grid.cellWidth - 0.5, y);
//     //             ctx.lineTo(x + grid.cellWidth - 0.5, y + grid.cellHeight);
//     //             ctx.stroke();
//     //         }



//     //         // Draw the row number in the right of each header cell
//     //         if (globalRow === null && globalCol !== null) {
//     //             ctx.fillStyle = "#107c41";
//     //         } else {
//     //             ctx.fillStyle = r + 1 === (globalRow % grid.rowsPerCanvas) && globalCol === null ? "#fff" : "#333";
//     //         }
//     //         if (globalRow === null && globalCol !== null) {
//     //             ctx.font = "bold 11pt Segoe UI, sans-serif";
//     //         } else {
//     //             ctx.font = r + 1 === (globalRow % grid.rowsPerCanvas) && globalCol === null ? "bold 11pt Segoe UI, sans-serif" : "11pt Segoe UI, sans-serif";
//     //         }
//     //         ctx.textAlign = "right";
//     //         ctx.textBaseline = "middle";
//     //         ctx.fillText((r + 1 + (this.yIndex * grid.rowsPerCanvas)).toString(), grid.cellWidth / 2, y + grid.cellHeight / 2);
//     //     }

//     //     return this.canvas;
//     // }
//     createVCanvas() {
//         const { ctx, grid, globalCol, globalRow } = this;
//         const { cellWidth, cellHeight, rowsPerCanvas } = grid;
//         const startRow = this.yIndex * rowsPerCanvas;

//         // Fill row backgrounds and labels
//         for (let r = 0; r < rowsPerCanvas; r++) {
//             const x=0, y = r * cellHeight;
//             const globalIndex = startRow + r;
//             const isSelected = globalIndex + 1 === globalRow && globalCol === null;
//             const isColSelected = globalRow === null && globalCol !== null;

//             // Background
//             ctx.fillStyle = isSelected ? "#107c41" : isColSelected ? "#caead8" : "#f5f5f5";
//             ctx.fillRect(0, y, cellWidth, cellHeight);

//             if (((r + 1) + (this.yIndex * grid.rowsPerCanvas)) === globalRow && globalCol !== null) {
//                 // console.log((globalRow%50), r);
//                 ctx.fillStyle = "#caead8";
//                 ctx.fillRect(x, y, grid.cellWidth, grid.cellHeight);

//                 // Right line
//                 ctx.beginPath();
//                 ctx.strokeStyle = "#107c41";
//                 ctx.lineWidth = 5;
//                 ctx.moveTo(x + grid.cellWidth + 0.5, y);
//                 ctx.lineTo(x + grid.cellWidth + 0.5, y + grid.cellHeight);
//                 ctx.stroke();
//                 ctx.lineWidth = 1;

//             }

//             // Text
//             ctx.fillStyle = isSelected ? "#fff" : isColSelected ? "#107c41" : "#333";
//             ctx.font = isSelected || isColSelected ? "bold 11pt Segoe UI, sans-serif" : "11pt Segoe UI, sans-serif";
//             ctx.textAlign = "right";
//             ctx.textBaseline = "middle";
//             ctx.fillText(globalIndex + 1, cellWidth - 5 , y + cellHeight / 2);
//         }

        
//         // 🧵 Shared row lines
//         ctx.beginPath();
//         ctx.strokeStyle = "rgba(33, 62, 64, 0.1)";
//         ctx.lineWidth = 1;
//         for (let r = 0; r <= rowsPerCanvas; r++) {
//             const y = r * cellHeight + 0.5;
//             ctx.moveTo(0, y);
//             ctx.lineTo(cellWidth, y);
//         }

//         // 🧵 Right border
//         ctx.strokeStyle = "rgba(33, 62, 64, 0.2)";
//         const rightX = cellWidth - 0.5;
//         ctx.moveTo(rightX, 0);
//         ctx.lineTo(rightX, rowsPerCanvas * cellHeight);

//         ctx.stroke();
//     }
//     /**
//      * Method to remove the horizontal canvas from the DOM
//      */
//     removeCanvas() {
//         this.canvas.remove();
//     }
// }