// --- CP03: Game Board Logic ---
const boardElement = document.getElementById("board");
const turnIndicator = document.getElementById("turn-indicator");
const resetBtn = document.getElementById("reset-btn");
const authSection = document.getElementById("auth-section");
const gameSection = document.getElementById("game-section");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

function initGame() {
    boardElement.innerHTML = ""; 
    board.forEach((cell, index) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        cellElement.dataset.index = index; 
        cellElement.innerText = cell;
        cellElement.addEventListener("click", handleCellClick);
        boardElement.appendChild(cellElement);
    });
    updateTurnIndicator();
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const cellIndex = clickedCell.dataset.index;

    // Ignore click if the cell is full or game is over
    if (board[cellIndex] !== "" || !gameActive) return; 

    board[cellIndex] = currentPlayer;
    clickedCell.innerText = currentPlayer;
    clickedCell.classList.add("taken");

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateTurnIndicator();
}

function updateTurnIndicator() {
    turnIndicator.innerText = `Player ${currentPlayer}'s Turn`;
}

if (resetBtn) {
    resetBtn.addEventListener("click", () => {
        board = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = "X";
        gameActive = true;
        initGame();
    });
}

function showGame() {
    if (authSection) authSection.style.display = "none";
    if (gameSection) gameSection.style.display = "block";
    initGame();
}

// FOR TESTING: Shows the game board immediately without needing to log in.
showGame();