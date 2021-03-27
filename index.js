const NUMS_PER_ROW = 9;
const INITIAL_NUMS_IN_BOARD = (NUMS_PER_ROW * 3) - 2;

const rand = () => (Math.floor(Math.random() * 9) + 1);

const startBoard = () => Array(INITIAL_NUMS_IN_BOARD).fill(null).map(() => rand());

const printableBoard = (board) => {
    let output = '';

    board.forEach((num, i) => {
        if (i > 0 && i % NUMS_PER_ROW === 0) {
            output += '\n';
        }

        if (!num) {
            output += ' _ ';
        } else {
            output += ` ${num} `;
        }
    });

    return output;
};

const printBoard = (board, msg) => {
    console.log(`${'='.repeat(10)}${' ' + msg + ' '}${'='.repeat(10)}`);
    console.log(printableBoard(board));
};

const arePair = (a, b) => a != null && a === b;
const areTen = (a, b) => a + b === 10;

const findNextNumAcross = (board, start) => {
    for (let i = start + 1; i < board.length; i += 1) {
        if (board[i] !== null) {
            return [board[i], i];
        }
    }

    return [null, null];
};

const findNextNumDown = (board, start) => {
    for (let i = start + NUMS_PER_ROW; i < board.length; i += NUMS_PER_ROW) {
        if (board[i] !== null) {
            return [board[i], i];
        }
    }

    return [null, null];
};


const matchAcross = (board, startFrom) => {
    let changed = false;
    let num = board[startFrom];

    let [nextNum, location] = findNextNumAcross(board, startFrom);

    if (arePair(num, nextNum) || areTen(num, nextNum)) {
        board[startFrom] = null;
        board[location] = null;
        changed = true;
    }

    return [board, changed];
};

const matchDown = (board, startFrom) => {
    let changed = false;
    let num = board[startFrom];

    let [nextNum, location] = findNextNumDown(board, startFrom);

    if (arePair(num, nextNum) || areTen(num, nextNum)) {
        board[startFrom] = null;
        board[location] = null;
        changed = true;
    }

    return [board, changed];
};

const check = (board) => {
    const numsOnly = board.filter(num => num != null);
    return board.concat(numsOnly);
};

const removeRows = (board) => {
    for (let i = 0; i < board.length; i += NUMS_PER_ROW) {
        const row = board.slice(i, i + NUMS_PER_ROW);

        if (checkGameOver(row)) {
            board.splice(i, NUMS_PER_ROW);
            return removeRows(board);
        }
    }

    return board;
};

const checkGameOver = board => board.reduce((acc, val) => acc + val, 0) === 0;

let board = startBoard();

const startingBoard = board.slice();

let numSweeps = 0;
let gameOver = false;
let maxRounds = 500;
let numRounds = 0;
let numCombinations = 0;

printBoard(board, 'Starting Board');

while (!gameOver) {
    let matchFound = false;

    for (let i = 0; i < board.length; i += 1) {
        const [updatedAcrossBoard, acrossChanged] = matchAcross(board, i);

        if (acrossChanged) {
            board = removeRows(updatedAcrossBoard);
            matchFound = true;
            numSweeps = 0;
            numCombinations += 1;

            printBoard(board, 'Pair matched across');

            break;
        } else {
            const [updatedDownBoard, downChanged] = matchDown(board, i);

            if (downChanged) {
                board = removeRows(updatedDownBoard);
                matchFound = true;
                numSweeps = 0;
                numCombinations += 1;

                printBoard(board, 'Pair matched down');

                break;
            }
        }
    }

    gameOver = checkGameOver(board);

    if (!gameOver) {
        if (!matchFound) {
            numSweeps += 1;

            if (numSweeps > 2) {
                gameOver = true;
            } else {
                board = removeRows(board);
                board = check(board);
                printBoard(board, 'No changes made, checking');
            }
        }
    }

    if (gameOver) {
        console.log(`Game Over, you won with ${numCombinations} combinations!`);
    }

    if (numRounds >= maxRounds) {
        console.log(`No solution after ${maxRounds} rounds and ${numCombinations} combinations. Exiting.`);
        printBoard(startingBoard, 'Started with');
        process.exit();
    } else {
        numRounds += 1;
    }
}
