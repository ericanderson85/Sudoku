import Cell from "./cell.js"

export default class Puzzle {
    constructor(puzzle, gridElement) {
        this.puzzle = [];
        for (let row = 0; row < 9; row++) {
            const cells = [];
            for (let column = 0; column < 9; column++) {
                cells.push(new Cell(row, column, puzzle[row][column]));
            }
            this.puzzle.push(cells);
        }
        this.updateCandidates();
        this.gridElement = gridElement;
        this.initializeGrid();
    }

    getRow(row) {
        return this.puzzle[row];
    }

    getColumn(column) {
        const cells = [];
        for (let row = 0; row < 9; row++) {
            cells.push(this.puzzle[row][column]);
        }
        return cells;
    }

    getBlock(row, column) {
        // Top left cell of the 3x3 block
        const startRow = Math.floor(row / 3) * 3;
        const startColumn = Math.floor(column / 3) * 3;

        const cells = [];
        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startColumn; j < startColumn + 3; j++) {
                cells.push(this.puzzle[i][j])
            }
        }

        return cells;
    }

    getUnit(row, column) {
        return [...this.getRow(row), ...this.getColumn(column), ...this.getBlock(row, column)];
    }

    getRows() {
        const rows = [];
        for (let row = 0; row < 9; row++) {
            const cells = [];
            for (let column = 0; column < 9; column++) {
                cells.push(this.puzzle[row][column]);
            }
            rows.push(cells);
        }
        return rows;
    }

    getColumns() {
        const columns = [];
        for (let column = 0; column < 9; column++) {
            const cells = [];
            for (let row = 0; row < 9; row++) {
                cells.push(this.puzzle[row][column]);
            }
            columns.push(cells);
        }
        return columns;
    }

    getBlocks() {
        const blocks = [];
        for (let startingRow = 0; startingRow <= 6; startingRow += 3) {
            for (let startingColumn = 0; startingColumn <= 6; startingColumn += 3) {
                const cells = [];
                for (let row = startingRow; row < startingRow + 3; row++) {
                    for (let column = startingColumn; column < startingColumn + 3; column++) {
                        cells.push(this.puzzle[row][column]);
                    }
                }
                blocks.push(cells);
            }
        }
        return blocks;
    }

    getUnits() {
        return [...this.getRows(), ...this.getColumns(), ...this.getBlocks()];
    }

    // setCell(row, column, number) {
    //     const cell = this.puzzle[row][column];
    //     cell.setNumber(number);
    //     this.updateNakedCandidates();
    // }

    updateCandidates() {
        for (let row = 0; row < 9; row++) {
            for (let column = 0; column < 9; column++) {
                const cell = this.puzzle[row][column];
                cell.setCandidates(cell.number === 0 ? new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]) : new Set());
            }
        }

        for (let row = 0; row < 9; row++) {
            for (let column = 0; column < 9; column++) {
                const cell = this.puzzle[row][column];
                const number = cell.getNumber();
                if (number === 0) {
                    continue;
                }

                const unit = this.getUnit(row, column);
                unit.forEach(otherCell => {
                    otherCell.removeCandidate(number);
                })
            }
        }
    }

    // Returns all the cells which only have one candidate
    nakedSingles() {
        const nakedSingles = [];

        for (let row = 0; row < 9; row++) {
            for (let column = 0; column < 9; column++) {
                const cell = this.puzzle[row][column];

                const candidates = cell.getCandidates();

                if (candidates.size === 1) {
                    const number = Array.from(candidates)[0];

                    nakedSingles.push({
                        cell: cell,
                        number: number
                    })
                }
            }
        }

        return nakedSingles;
    }

    // Returns all the cells which are the only candidate for a given unit
    hiddenSingles() {
        const hiddenSingles = [];
        const hiddenSingleIndices = new Set();

        const units = this.getUnits();
        for (const unit of units) {
            const cellIndexMap = new Map();

            // Maps numbers to the cells they could be in for this unit
            unit.forEach(cell => {
                if (cell.number === 0) {
                    const candidates = cell.getCandidates();
                    candidates.forEach(candidate => {
                        if (!cellIndexMap.has(candidate)) {
                            cellIndexMap.set(candidate, [cell]);
                        } else {
                            cellIndexMap.get(candidate).push(cell);
                        }
                    });
                }
            });

            cellIndexMap.forEach((cells, candidate) => {
                // If a candidate only appears once in a unit, it must go there
                if (cells.length === 1) {
                    const cell = cells[0];
                    const flatIndex = cell.row * 9 + cell.column;
                    if (hiddenSingleIndices.has(flatIndex)) {
                        return;
                    }

                    hiddenSingleIndices.add(flatIndex);
                    hiddenSingles.push({
                        cell: cell,
                        number: candidate
                    });
                }
            });
        }

        return hiddenSingles;
    }

    useBasicTechniques() {
        let changeCount = 0;

        const nakedSingles = this.nakedSingles();
        if (nakedSingles.length !== 0) {

            nakedSingles.forEach(nakedSingle => {
                nakedSingle.cell.setNumber(nakedSingle.number);
                changeCount++;
            });
            this.updateCandidates();
        }

        const nakedCount = changeCount;

        const hiddenSingles = this.hiddenSingles();
        if (hiddenSingles.length !== 0) {

            hiddenSingles.forEach(hiddenSingle => {
                hiddenSingle.cell.setNumber(hiddenSingle.number);
                changeCount++;
            });
            this.updateCandidates();
        }

        const hiddenCount = changeCount - nakedCount;

        console.log(`naked: ${nakedCount}, hidden: ${hiddenCount}`);

        return changeCount;
    }

    nakedGroups() {
        let removedCandidateCount = 0;
        const units = this.getUnits();

        units.forEach(unit => {
            const candidateMap = new Map();

            // Group cells by their candidates if they have 2, 3, or 4 candidates
            unit.forEach(cell => {
                if (cell.number !== 0) {
                    return;
                }
                const candidates = cell.getCandidates();

                if (candidates.size >= 2 && candidates.size <= 4) {
                    const key = Array.from(candidates).sort().join(',');
                    if (!candidateMap.has(key)) {
                        candidateMap.set(key, []);
                    }
                    candidateMap.get(key).push(cell);
                }
            });

            candidateMap.forEach((cells, key) => {
                const numCandidates = key.split(',').length;
                if (cells.length !== numCandidates) {
                    return;
                }

                // Eliminate these candidates from other cells in the same unit
                unit.forEach(otherCell => {
                    if (!cells.includes(otherCell) && otherCell.number === 0) {
                        key.split(',').forEach(candidate => {
                            if (otherCell.removeCandidate(parseInt(candidate))) {
                                removedCandidateCount++;
                            }
                        });
                    }
                });
            });
        });

        return removedCandidateCount;
    }

    pointing() {
        let removedCandidateCount = 0;

        for (let row = 0; row < 9; row++) {
            for (let column = 0; column < 9; column++) {
                const cell = this.puzzle[row][column];
                if (cell.getNumber() !== 0) {
                    continue;
                }

                const candidates = cell.getCandidates();
                candidates.forEach(candidate => {
                    const blockCells = this.getBlock(cell.row, cell.column);
                    const blockCellsWithCandidate = [];

                    blockCells.forEach(blockCell => {
                        if (blockCell.hasCandidate(candidate)) {
                            blockCellsWithCandidate.push(blockCell);
                        }
                    });

                    let sameRow = true;
                    let sameColumn = true;
                    blockCellsWithCandidate.forEach(blockCell => {
                        if (blockCell.row !== row) {
                            sameRow = false;
                        }
                        if (blockCell.column !== column) {
                            sameColumn = false;
                        }
                    });

                    if (sameRow) {
                        const rowCells = this.getRow(row);
                        rowCells.forEach(rowCell => {
                            if (!blockCells.includes(rowCell)) {
                                if (rowCell.removeCandidate(candidate)) {
                                    removedCandidateCount++
                                };
                            }
                        });
                    }

                    if (sameColumn) {
                        const columnCells = this.getColumn(column);
                        columnCells.forEach(columnCell => {
                            if (!blockCells.includes(columnCell)) {
                                if (columnCell.removeCandidate(candidate)) {
                                    removedCandidateCount++;
                                }
                            }
                        });
                    }
                });
            }
        }

        return removedCandidateCount;
    }

    useIntermediateTechniques() {
        const groups = this.nakedGroups();
        const pointing = this.pointing();
        console.log(`Groups: ${groups}, Pointing: ${pointing}`);
        return groups + pointing;
    }

    xWing() {
        let removedCandidateCount = 0;

        const xWingUnit = (isRow) => {
            const candidatePositions = new Map();

            for (let index = 0; index < 9; index++) {
                const cells = isRow ? this.getRow(index) : this.getColumn(index);
                let candidatesMap = new Map();

                cells.forEach(cell => {
                    const candidates = cell.getCandidates();
                    candidates.forEach(candidate => {
                        if (!candidatesMap.has(candidate)) {
                            candidatesMap.set(candidate, []);
                        }
                        candidatesMap.get(candidate).push(isRow ? cell.column : cell.row);
                    });
                });

                candidatesMap.forEach((positions, candidate) => {
                    if (positions.length !== 2) {
                        return;
                    }

                    const key = candidate + ':' + positions.sort().join(',');
                    if (!candidatePositions.has(key)) {
                        candidatePositions.set(key, []);
                    }
                    candidatePositions.get(key).push(index);
                });
            }

            candidatePositions.forEach((indices, key) => {
                if (indices.length !== 2) {
                    return;
                }

                const parts = key.split(':');
                const candidate = parseInt(parts[0]);
                const positions = parts[1].split(',').map(Number);

                positions.forEach(position => {
                    for (let index = 0; index < 9; index++) {
                        if (!indices.includes(index)) {
                            const cell = isRow ? this.puzzle[index][position] : this.puzzle[position][index];
                            if (cell.removeCandidate(candidate)) {
                                removedCandidateCount++;
                            }
                        }
                    }
                });
            });
        };

        xWingUnit(true);
        xWingUnit(false);

        return removedCandidateCount;
    }

    useAdvancedTechniques() {
        const xWing = this.xWing();
        console.log(`xWing: ${xWing}`);
        return xWing;
    }

    isSolved() {
        for (let row = 0; row < 9; row++) {
            for (let column = 0; column < 9; column++) {
                if (this.puzzle[row][column].getNumber() === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    solve() {
        let changesMade;
        do {
            changesMade = this.useBasicTechniques() > 0 || this.useIntermediateTechniques() > 0 || this.useAdvancedTechniques() > 0;
        } while (changesMade);

        if (this.isSolved()) {
            console.log("Puzzle solved successfully");
            return true;
        }
        console.log("Could not solve the puzzle");
        return false;
    }

    // solve(row, column) {
    //     // The puzzle has been solved
    //     if (row == 9) {
    //         return true;
    //     }

    //     // Go down a row
    //     if (column == 9) {
    //         return this.solve(row + 1, 0);
    //     }

    //     // Cell is not empty
    //     if (this.puzzle[row][column].getNumber() !== 0) {
    //         return this.solve(row, column + 1);
    //     }

    //     // Retrieve possible numbers for the current cell
    //     const candidates = this.puzzle[row][column].getCandidates();

    //     // Recursively solve the puzzle
    //     for (const number of candidates) {
    //         this.setCell(row, column, number);

    //         if (this.solve(row, column + 1)) {
    //             return true;
    //         }

    //         // Backtrack
    //         this.setCell(row, column, 0);
    //     }

    //     return false;
    // };

    // isSolveable() {
    //     // Deep copy puzzle to check if it is solveable
    //     const puzzleCopy = JSON.parse(JSON.stringify(this.puzzle));
    //     const result = this.solve(0, 0);
    //     this.puzzle = puzzleCopy;
    //     return result;
    // }

    initializeGrid() {
        let html = "";
        for (let row = 0; row < 9; row++) {
            html += "<tr>";
            for (let column = 0; column < 9; column++) {
                const number = this.puzzle[row][column].getNumber();
                const preFilledClass = number !== 0 ? 'pre-filled' : '';
                html += `<td id="cell-${row}-${column}" class="${preFilledClass}">${number || ""}</td>`;
            }
            html += "</tr>";
        }
        this.gridElement.innerHTML = html;
    };

    update() {
        for (let row = 0; row < 9; row++) {
            for (let column = 0; column < 9; column++) {
                const cellElement = document.getElementById(`cell-${row}-${column}`);

                const number = this.puzzle[row][column].getNumber();
                // Leave cell blank if 0
                cellElement.innerText = number === 0 ? "" : number;
            }
        }
    };

    toString() {
        let result = "";
        for (let row = 0; row < 9; row++) {
            for (let column = 0; column < 9; column++) {
                result += this.puzzle[row][column].toString() + "  ";
            }
            result += "\n";
        }
        return result;
    }
}