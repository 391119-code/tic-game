// CP07: Difficulty Levels and Vibe Comments for Tic-Tac-Toe AI

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
    aiLogic: "random", // AI picks a random available spot
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
    aiLogic: "intermediate", // AI blocks winning moves and takes winning moves, but sometimes makes random moves
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
    aiLogic: "unbeatable", // AI always blocks and takes winning moves, never loses
  },
};

// Function to get a random vibe comment for a given difficulty
function getVibeComment(difficulty) {
  const level = difficultyLevels[difficulty];
  if (!level) return "Let's play!";
  const comments = level.vibeComments;
  return comments[Math.floor(Math.random() * comments.length)];
}

// Function to get all difficulty options for display
function getDifficultyOptions() {
  return Object.keys(difficultyLevels).map((key) => ({
    id: key,
    name: difficultyLevels[key].name,
    description: difficultyLevels[key].description,
  }));
}

// Export for use in other modules
module.exports = {
  difficultyLevels,
  getVibeComment,
  getDifficultyOptions,
};