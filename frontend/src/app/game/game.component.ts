import { Component, OnInit, OnDestroy } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-game',
  template: `
    <div class="game-container">
      <div class="status">{{ status }}</div>
      <div class="board">
        <div *ngFor="let cell of board; let i = index" 
             class="cell"
             [class.x]="cell === 'X'"
             [class.o]="cell === 'O'"
             (click)="makeMove(i)">
          {{ cell }}
        </div>
      </div>
      <div class="info">
        <p>Current Turn: {{ currentTurn }}</p>
        <p>You are Player: {{ player }}</p>
        <button (click)="newGame()">New Game</button>
      </div>
    </div>
  `,
  styles: [`
    .game-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 20px;
    }
    .board {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 5px;
      background: #34495e;
      padding: 10px;
      border-radius: 10px;
      width: 300px;
      height: 300px;
    }
    .cell {
      width: 100%;
      height: 100%;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      font-weight: bold;
      cursor: pointer;
      border-radius: 5px;
      transition: all 0.3s ease;
    }
    .cell:hover:not(.x):not(.o) {
      background: #f0f0f0;
      transform: scale(0.98);
    }
    .cell.x {
      color: #e74c3c;
    }
    .cell.o {
      color: #3498db;
    }
    .status {
      margin-bottom: 20px;
      font-size: 24px;
      font-weight: bold;
      color: #2c3e50;
    }
    .info {
      margin-top: 20px;
      text-align: center;
    }
    button {
      padding: 10px 20px;
      font-size: 16px;
      background: #2ecc71;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    button:hover {
      background: #27ae60;
    }
  `]
})
export class GameComponent implements OnInit, OnDestroy {
  private socket: any;
  board: string[] = Array(9).fill(null);
  currentTurn: string = 'X';
  status: string = 'Game in progress';
  gameId: string = 'default-game';
  player: string;

  constructor() {
    this.player = Math.random() < 0.5 ? 'X' : 'O';
    
    console.log('Connecting to socket server');
    this.socket = io('/', {
      path: '/socket.io',
      transports: ['websocket'],
      upgrade: false
    });
  }

  ngOnInit() {
    this.socket.on('connect', () => {
      console.log('Connected to socket server');
      this.status = 'Game in progress';
      this.joinGame();
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('Socket connection error:', error);
      this.status = 'Connection error. Please check if the server is running.';
    });

    this.socket.on('gameState', (gameState: any) => {
      console.log('Received game state:', gameState);
      this.board = gameState.board;
      this.currentTurn = gameState.currentTurn;
      
      if (this.currentTurn === this.player) {
        this.status = 'Your turn!';
      } else {
        this.status = 'Waiting for opponent...';
      }
    });

    this.socket.on('gameOver', (data: any) => {
      console.log('Game over:', data);
      if (data.winner) {
        this.status = data.winner === this.player ? 'You win!' : 'You lose!';
      } else {
        this.status = "It's a draw!";
      }
    });
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  makeMove(index: number) {
    console.log('Attempting move at index:', index);
    if (this.board[index] || this.currentTurn !== this.player) {
      return;
    }

    this.socket.emit('makeMove', {
      gameId: this.gameId,
      index: index,
      player: this.player
    });
  }

  newGame() {
    console.log('Starting new game');
    this.socket.emit('newGame', { gameId: this.gameId });
    this.status = 'Game in progress';
  }

  private joinGame() {
    console.log('Joining game:', this.gameId);
    this.socket.emit('joinGame', { 
      gameId: this.gameId, 
      player: this.player 
    });
  }
} 