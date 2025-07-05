export class Cell {
    constructor( rowIndex, colIndex, value="") {
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
        this.value = value || "";
    }

    setValue(newValue){
        this.value = newValue;
    }

    getValue() {
        return this.value || '';
    }
}