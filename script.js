import Puzzle from "./puzzle.js";

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

// const hardPuzzle = [
//     [0, 0, 0, 0, 1, 0, 0, 3, 0],
//     [0, 0, 9, 0, 0, 5, 0, 0, 8],
//     [8, 0, 4, 0, 0, 6, 0, 2, 5],
//     [0, 0, 0, 0, 0, 0, 6, 0, 0],
//     [0, 0, 8, 0, 0, 4, 0, 0, 0],
//     [1, 2, 0, 0, 8, 7, 0, 0, 0],
//     [3, 0, 0, 9, 0, 0, 2, 0, 0],
//     [0, 6, 5, 0, 0, 8, 0, 0, 0],
//     [9, 0, 0, 0, 0, 0, 0, 0, 0]
// ];

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
]


const gridElement = document
    .getElementById("sudoku-grid")
    .getElementsByTagName("tbody")[0];

const puzzle = new Puzzle(mediumPuzzle, gridElement);

document.addEventListener('DOMContentLoaded', () => {
    const solveButton = document.querySelector('.solve-button');
    solveButton.addEventListener('click', solvePuzzle);
});

const solvePuzzle = () => {
    puzzle.solve();
    puzzle.update();
};