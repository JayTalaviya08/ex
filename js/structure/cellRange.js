export class CellRange {
  constructor(startRow, startCol, endRow, endCol) {
    this.startRow = startRow;
    this.startCol = startCol;
    this.endRow = endRow;
    this.endCol = endCol;
  }

  contains(row, col) {
    return (
      row >= this.startRow &&
      row <= this.endRow &&
      col >= this.startCol &&
      col <= this.endCol
    );
  }
}