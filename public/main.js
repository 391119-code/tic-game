const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// This line tells Express to serve your HTML, CSS, and JS files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Allow CORS for dev
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

const DATA_DIR = path.join(__dirname, "data");
const GAMES_FILE = path.join(DATA_DIR, "games.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(GAMES_FILE)) fs.writeFileSync(GAMES_FILE, JSON.stringify([]));
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify([]));

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return [];
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Health check
app.get("/api/healthz", (req, res) => {
  res.json({ status: "ok" });
});

// --- Games routes ---
app.get("/api/games", (req, res) => {
  res.json(readJSON(GAMES_FILE));
});

app.get("/api/games/:id", (req, res) => {
  const games = readJSON(GAMES_FILE);
  const game = games.find((g) => g.id === req.params.id);
  if (!game) return res.status(404).json({ error: "Game not found" });
  res.json(game);
});

app.post("/api/games", (req, res) => {
  const games = readJSON(GAMES_FILE);
  const newGame = { id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
  games.push(newGame);
  writeJSON(GAMES_FILE, games);
  res.status(201).json(newGame);
});

app.put("/api/games/:id", (req, res) => {
  const games = readJSON(GAMES_FILE);
  const idx = games.findIndex((g) => g.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Game not found" });
  games[idx] = { ...games[idx], ...req.body };
  writeJSON(GAMES_FILE, games);
  res.json(games[idx]);
});

app.delete("/api/games/:id", (req, res) => {
  let games = readJSON(GAMES_FILE);
  const idx = games.findIndex((g) => g.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Game not found" });
  games.splice(idx, 1);
  writeJSON(GAMES_FILE, games);
  res.json({ success: true });
});

// --- Users routes ---
app.get("/api/users", (req, res) => {
  res.json(readJSON(USERS_FILE));
});

app.get("/api/users/:id", (req, res) => {
  const users = readJSON(USERS_FILE);
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

app.post("/api/users", (req, res) => {
  const users = readJSON(USERS_FILE);
  const newUser = { id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
  users.push(newUser);
  writeJSON(USERS_FILE, users);
  res.status(201).json(newUser);
});

app.put("/api/users/:id", (req, res) => {
  const users = readJSON(USERS_FILE);
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "User not found" });
  users[idx] = { ...users[idx], ...req.body };
  writeJSON(USERS_FILE, users);
  res.json(users[idx]);
});

app.delete("/api/users/:id", (req, res) => {
  let users = readJSON(USERS_FILE);
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "User not found" });
  users.splice(idx, 1);
  writeJSON(USERS_FILE, users);
  res.json({ success: true });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});