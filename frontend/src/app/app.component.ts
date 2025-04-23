import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <header>
        <h1>Tic Tac Toe</h1>
      </header>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    header {
      text-align: center;
      margin-bottom: 30px;
    }
    h1 {
      color: #2c3e50;
      font-size: 2.5em;
    }
    main {
      display: flex;
      justify-content: center;
    }
  `]
})
export class AppComponent {
  title = 'Tic Tac Toe';
} 