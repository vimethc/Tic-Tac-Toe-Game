const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mysql2025', // Empty password for root user
    database: 'tictactoe_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Game state
let games = {};

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('New client connected');

    // Handle joining game
    socket.on('joinGame', (data) => {
        const { gameId, player } = data;
        console.log(`Player ${player} joining game ${gameId}`);
        
        if (!games[gameId]) {
            games[gameId] = {
                board: Array(9).fill(null),
                players: {},
                currentTurn: 'X'
            };
        }
        
        games[gameId].players = Object.assign({}, games[gameId].players, { [player]: socket.id });
        socket.join(gameId);
        
        io.to(gameId).emit('gameState', games[gameId]);
    });

    // Handle new game request
    socket.on('newGame', (data) => {
        const { gameId } = data;
        console.log(`New game requested for game ${gameId}`);
        
        if (games[gameId]) {
            games[gameId] = Object.assign({}, {
                board: Array(9).fill(null),
                players: games[gameId].players,
                currentTurn: 'X'
            });
            
            io.to(gameId).emit('gameState', games[gameId]);
        }
    });

    // Handle moves
    socket.on('makeMove', (data) => {
        const { gameId, index, player } = data;
        console.log(`Player ${player} making move at index ${index} in game ${gameId}`);
        
        if (games[gameId] && games[gameId].board[index] === null) {
            games[gameId].board[index] = player;
            games[gameId].currentTurn = player === 'X' ? 'O' : 'X';
            
            io.to(gameId).emit('gameState', games[gameId]);
            
            const winner = checkWinner(games[gameId].board);
            if (winner) {
                io.to(gameId).emit('gameOver', { winner });
            } else if (!games[gameId].board.includes(null)) {
                io.to(gameId).emit('gameOver', { winner: null });
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Helper function to check for winner
function checkWinner(board) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let line of lines) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

// Basic routes
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    // Add user registration logic here
    res.json({ message: 'Registration endpoint' });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    // Add login logic here
    res.json({ message: 'Login endpoint' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 