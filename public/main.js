// --- CP03: Game Board Logic ---
const boardElement = document.getElementById("board");
const turnIndicator = document.getElementById("turn-indicator");
const resetBtn = document.getElementById("reset-btn");
const authSection = document.getElementById("auth-section");
const gameSection = document.getElementById("game-section");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

// Add this right below: let gameActive = true;
const winningConditions = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal 1
    [2, 4, 6]  // Diagonal 2
];
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

    // ... inside handleCellClick
        board[cellIndex] = currentPlayer;
        clickedCell.innerText = currentPlayer;
        clickedCell.classList.add("taken");

        checkResult();
}
function checkResult() {
    let roundWon = false;

    // Check if the current board matches any winning conditions
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        turnIndicator.innerText = `Player ${currentPlayer} Wins! 🎉`;
        gameActive = false;
        return;
    }

    // Check for a draw (no empty strings left in the board array)
    if (!board.includes("")) {
        turnIndicator.innerText = "It's a Draw! 🤝";
        gameActive = false;
        return;
    }

    // If no win or draw, switch player and update the text
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
// --- Auth Form Handlers ---
document.getElementById("register-form").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevents the page from refreshing

    // TODO: Send registration data to your backend here

    // Transition to the game screen
    showGame();
});

document.getElementById("login-form").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevents the page from refreshing

    // TODO: Verify login data with your backend here

    // Transition to the game screen
    showGame();
});