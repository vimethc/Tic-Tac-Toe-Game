# Real-Time Multiplayer Tic Tac Toe 🎮

A real-time multiplayer Tic Tac Toe game built using **Angular**, **Node.js**, **Socket.IO**, and **MySQL**. This project supports live gameplay, automatic turn handling, win detection, and a responsive user interface.

## 🚀 Features

- 🔄 Real-time multiplayer gameplay with WebSockets
- 🎯 Automatic turn management and win detection
- 🔁 Game reset functionality
- 📦 MySQL integration for future data persistence
- 💻 Responsive and interactive UI with Angular
- 🔒 Secure WebSocket setup and proper error handling

## 🛠️ Tech Stack

**Frontend:**
- Angular
- Socket.IO Client
- SCSS/CSS

**Backend:**
- Node.js
- Express.js
- Socket.IO
- MySQL

## 🧠 How It Works

- Players are connected through WebSockets
- The server manages the game state, turn switching, and win conditions
- The UI updates in real-time as players make moves
- A new game can be initiated anytime by clicking the "New Game" button

## 🖥️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/vimethc/Tic-Tac-Toe-Game.git
cd Tic-Tac-Toe-Game

## Backend Setup
cd server
npm install
npm start

##Frontend Setup
cd client
npm install
ng serve


