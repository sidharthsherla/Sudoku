let generatedBoard;
let difficulty;

function generateSudoku(level) {
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));

    // Check if a number is valid in a specific cell
    function isValid(cell, number) {
        const [row, col] = cell;
        // Check if the number is already in the same row or column
        for (let i = 0; i < 9; i++) {
            if ((i !== row && board[i][col] === number) || (i !== col && board[row][i] === number)) {
                return false;
            }
        }
        // Check if the number is already in the same 3x3 subgrid
        const subgridRow = Math.floor(row / 3) * 3;
        const subgridCol = Math.floor(col / 3) * 3;
        for (let i = subgridRow; i < subgridRow + 3; i++) {
            for (let j = subgridCol; j < subgridCol + 3; j++) {
                if (i !== row && j !== col && board[i][j] === number) {
                    return false;
                }
            }
        }
        return true;
    }

    function fillSudoku() {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        // Shuffle the numbers array to randomize the order
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }

        function fillCell(row, col) {
            if (row === 9) {
                return true;
            }

            const nextRow = col === 8 ? row + 1 : row;
            const nextCol = col === 8 ? 0 : col + 1;

            if (board[row][col] !== 0) {
                return fillCell(nextRow, nextCol);
            }

            for (const number of numbers) {
                if (isValid([row, col], number)) {
                    board[row][col] = number;
                    if (fillCell(nextRow, nextCol)) {
                        return true;
                    }
                    board[row][col] = 0;
                }
            }

            return false;
        }

        fillCell(0, 0);
    }

    function hideNumbers(board) {
        const totalCells = 81;
        let cellsToHide;

        switch (level) {
            case 'easy':
                cellsToHide = Math.ceil(0.2 * totalCells);
                break;
            case 'medium':
                cellsToHide = Math.ceil(0.4 * totalCells);
                break;
            case 'hard':
                cellsToHide = Math.ceil(0.6 * totalCells);
                break;
            default:
                cellsToHide = Math.ceil(0.4 * totalCells);
        }

        for (let i = 0; i < cellsToHide; i++) {
            let row, col;
            do {
                row = Math.floor(Math.random() * 9);
                col = Math.floor(Math.random() * 9);
            } while (board[row][col] === 0);

            board[row][col] = 0;
        }
    }

    fillSudoku();

    hideNumbers(board, level);

    generatedBoard = board;

    updateTable(board);
}

function updateTable(board) {
    const sudokuBoard = document.getElementById('sudokuBoard');
    sudokuBoard.innerHTML = ''; // Clear the previous table

    for (let i = 0; i < 9; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('td');
            cell.textContent = board[i][j] === 0 ? '' : board[i][j];
            cell.contentEditable = board[i][j] === 0 ? 'true' : 'false';
            cell.id = `cell_${i}_${j}`;
            row.appendChild(cell);
        }
        sudokuBoard.appendChild(row);
    }
}

function highlightCells(number) {
    const cells = document.querySelectorAll('td');

    cells.forEach(cell => {
        const [row, col] = cell.id.split('_').slice(1).map(Number); // Get row and column from cell ID
        const cellValue = generatedBoard[row][col]; // Get the cell value from the generated board
        if (!isNaN(cellValue) && cellValue === number) {
            cell.classList.add('highlight');
        } else {
            cell.classList.remove('highlight');
        }
    });

    // Check if all possibilities for the number are completed
    const numberCells = document.querySelectorAll('.number-cell');
    let isCompleted = true;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (generatedBoard[i][j] === number) {
                const cell = document.getElementById(`cell_${i}_${j}`);
                if (!cell.classList.contains('highlight')) {
                    isCompleted = false;
                    break;
                }
            }
        }
        if (!isCompleted) {
            break;
        }
    }

    // Highlight the number cell if all possibilities are completed
    numberCells.forEach(cell => {
        if (parseInt(cell.textContent) === number) {
            if (isCompleted) {
                cell.classList.add('completed');
            } else {
                cell.classList.remove('completed');
            }
        }
    });
}

function isSudokuSolved(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
                return false;
            }
        }
    }
    return true;
}

function checkInput() {
    const board = [];
    let isCorrect = true; 

    for (let i = 0; i < 9; i++) {
        board.push([]);
        for (let j = 0; j < 9; j++) {
            const cell = document.getElementById(`cell_${i}_${j}`);
            const value = cell.textContent.trim();
            const inputValue = value === '' ? 0 : parseInt(value);
            board[i].push(inputValue);

            // Check if the input value is valid
            if (!isNaN(inputValue) && inputValue !== 0 && !isValid([i, j], inputValue, generatedBoard)) {
                cell.classList.add('incorrect'); // Highlight incorrect inputs in red
                isCorrect = false; // Set the flag to false
            } else {
                cell.classList.remove('incorrect'); // Remove red highlight for correct inputs
            }
        }
    }

    // Check if the puzzle is solved
    if (isCorrect && isSudokuSolved(board)) {
        const result = document.getElementById('result');
        result.textContent = 'Congratulations! You have solved the Sudoku puzzle!';
    }
}

function isValid(cell, value, initialBoard) {
    const [row, col] = cell;

    // Check row and column
    for (let i = 0; i < 9; i++) {
        if ((i !== row && initialBoard[i][col] === value) || (i !== col && initialBoard[row][i] === value)) {
            return false;
        }
    }

    // Check 3x3 subgrid
    const subgridRow = Math.floor(row / 3) * 3;
    const subgridCol = Math.floor(col / 3) * 3;
    for (let i = subgridRow; i < subgridRow + 3; i++) {
        for (let j = subgridCol; j < subgridCol + 3; j++) {
            if (i !== row && j !== col && initialBoard[i][j] === value) {
                return false;
            }
        }
    }

    return true;
}

const difficultySelect = document.getElementById('difficulty');
difficultySelect.addEventListener('change', () => {
    difficulty = difficultySelect.value;
    generateSudoku(difficulty);
});

difficulty = 'medium';
generateSudoku(difficulty);