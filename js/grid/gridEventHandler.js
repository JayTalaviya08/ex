import { handleSelectionClick } from "./modulers.js";

export class GridEventHandler {
    constructor(grid) {
        this.grid = grid;
    }

    eventListeners() {
        window.addEventListener('scroll', (e) => {
            this.grid.renderCanvases();
            this.grid.renderHeaders();
        });

        this.grid.wrapper.addEventListener('click', (e) => handleSelectionClick.call(this.grid, e));
    }

    display() {
        return (this.grid);
    }
}