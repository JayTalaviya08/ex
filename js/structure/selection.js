export class Selection {
  constructor() {
    this.startRow = null;
    this.startCol = null;
    this.endRow = null;
    this.endCol = null;
  }

  setStart(row, col) {
    this.startRow = row;
    this.startCol = col;
  }

  setEnd(row, col) {
    this.endRow = row;
    this.endCol = col;
  }

  getRange() {
    return {
      top: Math.min(this.startRow, this.endRow),
      left: Math.min(this.startCol, this.endCol),
      bottom: Math.max(this.startRow, this.endRow),
      right: Math.max(this.startCol, this.endCol),
    };
  }

  isActive() {
    return this.startRow !== null && this.startCol !== null;
  }
}