const isValid = (puzzle, row, column, number) => {
    // Check if the cell is already filled
    if (puzzle[row][column] != 0) {
        return false;
    }

    // Check the row and column for the number
    for (let i = 0; i < 9; i++) {
        if (puzzle[row][i] == number || puzzle[i][column] == number) {
            return false;
        }
    }

    // Top left cell of the 3x3 subgrid
    const subGridRow = Math.floor(row / 3) * 3;
    const subGridCol = Math.floor(column / 3) * 3;

    // Check the subgrid for the number
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (puzzle[subGridRow + i][subGridCol + j] == number) {
                return false;
            }
        }
    }

    return true;
};

let numbersAttempted = 0;
const solve = async (puzzle, row, column) => {
    // The puzzle has been solved
    if (row == 9) {
        return true;
    }

    // Go down a row
    if (column == 9) {
        return await solve(puzzle, row + 1, 0);
    }

    // Cell is not empty
    if (puzzle[row][column] != 0) {
        return await solve(puzzle, row, column + 1);
    }

    // Recursively solve the puzzle
    for (let number = 1; number <= 9; number++) {
        if (isValid(puzzle, row, column, number)) {
            numbersAttempted++;
            puzzle[row][column] = number;
            await new Promise((resolve) => setTimeout(resolve, 5));
            update();

            if (await solve(puzzle, row, column + 1)) {
                return true;
            }

            // Backtrack
            puzzle[row][column] = 0;
            await new Promise((resolve) => setTimeout(resolve, 5));
            update();
        }
    }

    return false;
};

const gridElement = document
    .getElementById("sudoku-grid")
    .getElementsByTagName("tbody")[0];

const initializeGrid = () => {
    let html = "";
    for (let row = 0; row < 9; row++) {
        html += "<tr>";
        for (let col = 0; col < 9; col++) {
            const value = puzzle[row][col];
            const preFilledClass = value !== 0 ? 'pre-filled' : '';
            html += `<td id="cell-${row}-${col}" class="${preFilledClass}">${value || ""}</td>`;
        }
        html += "</tr>";
    }
    gridElement.innerHTML = html;
};

const update = () => {
    const numbersElement = document.getElementById("numbers");
    numbersElement.innerText = numbersAttempted;

    for (let row = 0; row < 9; row++) {
        for (let column = 0; column < 9; column++) {
            const cellElemenet = document.getElementById(`cell-${row}-${column}`);

            // Leave cell blank if 0
            cellElemenet.innerText = puzzle[row][column] === 0 ? "" : puzzle[row][column];
        }
    }
};

let timerInterval;
let elapsedTime = 0;

const startTimer = () => {
    const startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        document.getElementById("timer").innerText = formatTime(elapsedTime);
    }, 1000);
};

const stopTimer = () => {
    clearInterval(timerInterval);
};

const formatTime = (time) => {
    const seconds = Math.floor(time / 1000) % 60;
    const minutes = Math.floor(time / 60000) % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
};

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

const puzzle = mediumPuzzle;

initializeGrid();
const solvePuzzle = async () => {
    startTimer();
    const result = await solve(puzzle, 0, 0);
    stopTimer();
    return result;
};
