class Puzzle {
    constructor(puzzle, gridElement) {
        this.puzzle = puzzle;
        this.gridElement = gridElement;
        this.initializeGrid();
    }

    isSolveable() {
        // Deep copy puzzle to check if it is solveable
        const puzzleCopy = JSON.parse(JSON.stringify(this.puzzle));
        const result = this.solve(0, 0);
        this.puzzle = puzzleCopy;
        return result;
    }

    isValid(row, column, number) {
        // Check if the cell is already filled
        if (this.puzzle[row][column] != 0) {
            return false;
        }

        // Check the row and column for the number
        for (let i = 0; i < 9; i++) {
            if (this.puzzle[row][i] == number || this.puzzle[i][column] == number) {
                return false;
            }
        }

        // Top left cell of the 3x3 subgrid
        const subGridRow = Math.floor(row / 3) * 3;
        const subGridCol = Math.floor(column / 3) * 3;

        // Check the subgrid for the number
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.puzzle[subGridRow + i][subGridCol + j] == number) {
                    return false;
                }
            }
        }

        return true;
    };

    solve(row, column) {
        // The puzzle has been solved
        if (row == 9) {
            return true;
        }

        // Go down a row
        if (column == 9) {
            return this.solve(row + 1, 0);
        }

        // Cell is not empty
        if (this.puzzle[row][column] != 0) {
            return this.solve(row, column + 1);
        }

        // Recursively solve the puzzle
        for (let number = 1; number <= 9; number++) {
            if (this.isValid(row, column, number)) {
                this.puzzle[row][column] = number;

                if (this.solve(row, column + 1)) {
                    return true;
                }

                // Backtrack
                this.puzzle[row][column] = 0;
            }
        }

        return false;
    };

    initializeGrid() {
        let html = "";
        for (let row = 0; row < 9; row++) {
            html += "<tr>";
            for (let col = 0; col < 9; col++) {
                const value = this.puzzle[row][col];
                const preFilledClass = value !== 0 ? 'pre-filled' : '';
                html += `<td id="cell-${row}-${col}" class="${preFilledClass}">${value || ""}</td>`;
            }
            html += "</tr>";
        }
        this.gridElement.innerHTML = html;
    };

    update() {
        for (let row = 0; row < 9; row++) {
            for (let column = 0; column < 9; column++) {
                const cellElement = document.getElementById(`cell-${row}-${column}`);

                // Leave cell blank if 0
                cellElement.innerText = this.puzzle[row][column] === 0 ? "" : this.puzzle[row][column];
            }
        }
    };
}

const easyPuzzle = [
    [0, 6, 0, 4, 8, 0, 2, 0, 5],
    [1, 4, 7, 0, 3, 0, 0, 0, 0],
    [0, 0, 2, 0, 0, 9, 4, 3, 0],
    [5, 0, 0, 9, 0, 3, 0, 6, 0],
    [0, 0, 3, 8, 2, 5, 0, 0, 4],
    [2, 0, 4, 0, 0, 0, 5, 9, 0],
    [9, 3, 0, 0, 0, 8, 1, 0, 0],
    [0, 1, 0, 6, 9, 0, 0, 2, 8],
    [7, 0, 0, 0, 1, 0, 0, 0, 6],
];

const mediumPuzzle = [
    [0, 0, 2, 6, 0, 3, 0, 0, 0],
    [0, 6, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 3, 4, 8, 9, 0, 0, 0],
    [0, 7, 0, 0, 4, 0, 1, 0, 0],
    [4, 0, 0, 0, 1, 0, 9, 0, 7],
    [0, 0, 9, 0, 0, 0, 0, 0, 0],
    [0, 0, 8, 0, 5, 0, 7, 3, 0],
    [2, 0, 4, 0, 0, 0, 0, 0, 8],
    [0, 0, 0, 0, 0, 0, 0, 6, 0]
];

const hardPuzzle = [
    [0, 0, 0, 0, 1, 0, 0, 3, 0],
    [0, 0, 9, 0, 0, 5, 0, 0, 8],
    [8, 0, 4, 0, 0, 6, 0, 2, 5],
    [0, 0, 0, 0, 0, 0, 6, 0, 0],
    [0, 0, 8, 0, 0, 4, 0, 0, 0],
    [1, 2, 0, 0, 8, 7, 0, 0, 0],
    [3, 0, 0, 9, 0, 0, 2, 0, 0],
    [0, 6, 5, 0, 0, 8, 0, 0, 0],
    [9, 0, 0, 0, 0, 0, 0, 0, 0]
];


const gridElement = document
    .getElementById("sudoku-grid")
    .getElementsByTagName("tbody")[0];

const puzzle = new Puzzle(hardPuzzle, gridElement);

const solvePuzzle = () => {
    puzzle.solve(0, 0);
    puzzle.update();
};