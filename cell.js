export default class Cell {
    constructor(row, column, number) {
        this.row = row;
        this.column = column;
        this.number = number;
        this.candidates;
    }

    getNumber() {
        return this.number;
    }

    getCandidates() {
        return this.candidates;
    }

    setNumber(number) {
        this.number = number;
        this.setCandidates(new Set());
    }

    setCandidates(candidates) {
        this.candidates = candidates;
    }

    hasCandidate(number) {
        return this.candidates.has(number);
    }

    removeCandidate(number) {
        return this.candidates.delete(number);
    }

    equals(otherCell) {
        return this.row === otherCell.row && this.col === otherCell.col;
    }

    toString() {
        return `(${this.row}, ${this.column}): ${this.number || ' '}`;
    }
}