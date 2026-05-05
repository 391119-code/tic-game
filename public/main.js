// --- CP03: Game Board Logic ---
const boardElement = document.getElementById("board");
const turnIndicator = document.getElementById("turn-indicator");
const resetBtn = document.getElementById("reset-btn");
const authSection = document.getElementById("auth-section");
const gameSection = document.getElementById("game-section");
const historyBtn = document.getElementById("history-btn");
const historySection = document.getElementById("history-section");
const historyList = document.getElementById("history-list");
const difficultySelect = document.getElementById("difficulty-select");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let gameMode = "PvAI"; // Default to PvAI
let isAIThinking = false; // Prevent multiple AI moves
let currentDifficulty = "medium"; // Default difficulty

// Winning conditions
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

// Difficulty levels and vibe comments
const difficultyLevels = {
  easy: {
    name: "Easy",
    description: "The AI makes random moves. Perfect for beginners!",
    vibeComments: [
      "Easy mode: Let's take it slow!",
      "I'm just here for fun. Your move!",
      "No pressure, just vibes!",
      "I might miss a win, but I'll still have fun!",
      "Easy does it!",
    ],
    aiLogic: "random",
  },
  medium: {
    name: "Medium",
    description: "The AI plays smart but makes occasional mistakes.",
    vibeComments: [
      "Medium mode: Let's see what you've got!",
      "I'll try my best, but I might slip up!",
      "This should be a fair challenge!",
      "I'll block you... sometimes.",
      "Medium difficulty: Bring it on!",
    ],
    aiLogic: "intermediate",
  },
  hard: {
    name: "Hard",
    description: "The AI is unbeatable. Good luck!",
    vibeComments: [
      "Hard mode: Prepare for a challenge!",
      "I see all your moves. Do you see mine?",
      "Unbeatable? Let's find out!",
      "Every move counts. No mistakes here!",
      "Hard difficulty: Can you outsmart me?",
    ],
    aiLogic: "unbeatable",
  },
};

function getVibeComment(difficulty) {
  const level = difficultyLevels[difficulty];
  if (!level) return "Let's play!";
  const comments = level.vibeComments;
  return comments[Math.floor(Math.random() * comments.length)];
}

function initGame() {
    boardElement.innerHTML = "";
    isAIThinking = false; // Reset AI thinking state
    board.forEach((cell, index) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        cellElement.dataset.index = index;
        cellElement.innerText = cell;
        cellElement.addEventListener("click", handleCellClick);
        boardElement.appendChild(cellElement);
    });
    updateTurnIndicator();
    
    // Display vibe comment for AI games
    if (gameMode === "PvAI") {
      const vibeElement = document.getElementById("vibe-comment");
      if (vibeElement) {
        vibeElement.textContent = getVibeComment(currentDifficulty);
      }
    }
}

function handleCellClick(event) {
    if (isAIThinking || !gameActive) return; // Ignore clicks while AI is thinking

    const clickedCell = event.target;
    const cellIndex = clickedCell.dataset.index;

    if (board[cellIndex] !== "") return;

    // Human move
    board[cellIndex] = currentPlayer;
    clickedCell.innerText = currentPlayer;
    clickedCell.classList.add("taken");

    checkResult();

    // If game is still active and it's AI's turn in PvAI mode
    if (gameActive && gameMode === "PvAI" && currentPlayer === "O") {
        isAIThinking = true;
        setTimeout(makeAIMove, 500); // Delay for UX
    }
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
        saveGame(`Player ${currentPlayer} Wins`);
        return;
    }

    // Check for a draw (no empty strings left in the board array)
    if (!board.includes("")) {
        turnIndicator.innerText = "It's a Draw! 🤝";
        gameActive = false;
        saveGame("Draw");
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
    resetBtn.addEventListener("click", resetGame);
}

function showGame() {
    if (authSection) authSection.style.display = "none";
    if (gameSection) gameSection.style.display = "block";
    initGame();
}

// --- AI Logic ---
function makeAIMove() {
    if (!gameActive) {
        isAIThinking = false;
        return;
    }

    let bestMove;
    switch (currentDifficulty) {
        case "easy":
            bestMove = findRandomMove();
            break;
        case "medium":
            // 70% chance to make a smart move, 30% chance to make a random move
            bestMove = Math.random() < 0.7 ? findIntermediateMove() : findRandomMove();
            break;
        case "hard":
            bestMove = findBestMove(board);
            break;
        default:
            bestMove = findBestMove(board);
    }

    if (bestMove !== null && bestMove !== undefined) {
        board[bestMove] = "O";
        const cells = document.querySelectorAll(".cell");
        cells[bestMove].innerText = "O";
        cells[bestMove].classList.add("taken");
        
        // Display a new vibe comment after AI move
        const vibeElement = document.getElementById("vibe-comment");
        if (vibeElement) {
            vibeElement.textContent = getVibeComment(currentDifficulty);
        }
        
        checkResult();
    }
    isAIThinking = false;
}

function findRandomMove() {
    const availableMoves = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") availableMoves.push(i);
    }
    return availableMoves.length > 0 
        ? availableMoves[Math.floor(Math.random() * availableMoves.length)]
        : null;
}

function findIntermediateMove() {
    // First, check for winning move
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "O";
            if (checkWin(board, "O")) {
                board[i] = "";
                return i;
            }
            board[i] = "";
        }
    }
    
    // Then, block opponent's winning move
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "X";
            if (checkWin(board, "X")) {
                board[i] = "";
                return i;
            }
            board[i] = "";
        }
    }
    
    // If no immediate win or block, make a random move
    return findRandomMove();
}

function findBestMove(board) {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    if (checkWin(board, "O")) return 10 - depth;
    if (checkWin(board, "X")) return depth - 10;
    if (board.every(cell => cell !== "")) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWin(board, player) {
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }
    return false;
}

// --- CP05: Save and Load History ---
async function saveGame(result) {
    const gameData = {
        board: board,
        result: result,
        difficulty: currentDifficulty,
        gameMode: gameMode
    };

    try {
        await fetch('/api/games', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameData)
        });

        // Refresh the list immediately if the history panel is currently open
        if (historySection && historySection.style.display === "block") {
            loadHistory();
        }
    } catch (error) {
        console.error("Failed to save game:", error);
    }
}

async function loadHistory() {
    try {
        const response = await fetch('/api/games');
        const games = await response.json();

        historyList.innerHTML = ""; // Clear out the old list

        if (games.length === 0) {
            historyList.innerHTML = "<li>No games played yet.</li>";
            return;
        }

        // Loop backwards so the newest games show up at the top
        for (let i = games.length - 1; i >= 0; i--) {
            const game = games[i];
            const li = document.createElement("li");
            const dateStr = new Date(game.createdAt).toLocaleString();

            li.style.borderBottom = "1px solid #ccc";
            li.style.padding = "5px 0";
            li.innerText = `${dateStr} - Result: ${game.result} ${game.difficulty ? `(Difficulty: ${game.difficulty})` : ''}`;

            historyList.appendChild(li);
        }
    } catch (error) {
        console.error("Failed to load history:", error);
    }
}

if (historyBtn) {
    historyBtn.addEventListener("click", () => {
        if (historySection.style.display === "none") {
            historySection.style.display = "block";
            loadHistory(); // Fetch the games when opening the menu
        } else {
            historySection.style.display = "none";
        }
    });
}

// --- Game Mode and Difficulty Toggle ---
function toggleGameMode() {
    gameMode = document.getElementById("ai-toggle").checked ? "PvAI" : "PvP";
    resetGame();
}

function setDifficulty() {
    if (difficultySelect) {
        currentDifficulty = difficultySelect.value;
        resetGame();
    }
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    isAIThinking = false;
    initGame();
}

if (document.getElementById("ai-toggle")) {
    document.getElementById("ai-toggle").addEventListener("change", toggleGameMode);
}

if (difficultySelect) {
    difficultySelect.addEventListener("change", setDifficulty);
}

// Initialize difficulty selector
if (difficultySelect) {
    Object.keys(difficultyLevels).forEach(difficulty => {
        const option = document.createElement("option");
        option.value = difficulty;
        option.textContent = difficultyLevels[difficulty].name;
        difficultySelect.appendChild(option);
    });
    difficultySelect.value = currentDifficulty;
}

// --- Auth Form Handlers ---
document.getElementById("register-form").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevents the page from refreshing
    showGame();
});

document.getElementById("login-form").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevents the page from refreshing
    showGame();
});
