export class Column {
  constructor(index, width = 80) {
    this.index = index;
    this.width = width;
  }

  resize(newWidth) {
    this.width = newWidth;
  }

  getWidth() {
    return this.width;
  }
}
