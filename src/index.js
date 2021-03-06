import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={'square ' + (props.winningSquare ? 'winning-square' : '') } onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i, winner) {
    return (
      <Square
        winningSquare={winner}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
      />
    );
  }

  render() {
    let board = [];
    let cell = 0;

    for (let i = 0; i < 3; i++) {
      let squares = [];

      for (let j = 0; j < 3; j++) {
        const winningSquare = this.props.winningSquares && this.props.winningSquares.indexOf(cell) !== -1;
        squares = squares.concat(this.renderSquare(cell, winningSquare));
        cell++;
      }
      board = board.concat(<div className="board-row" key={i}>{squares}</div>);
    };

    return board;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      isDescending: true
    }
  }

  handleClick(i) {
    const locations = [
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3]
    ];
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          location: locations[i]
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  sortHistory() {
    this.setState({
      isDescending: !this.state.isDescending
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move 
        ? "Go to move #" + move + " @ " + history[move].location
        : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} className={move === this.state.stepNumber ? 'selected-move' : ''}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.winner;
    } else if (history.length === 10) {
      status = `It's a draw!`;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winningSquares={winner ? winner.squares : null}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.isDescending ? moves : moves.reverse()}</ol>
          <button onClick={() => this.sortHistory()}>
            Sort by: {this.state.isDescending ? "Descending" : "Asending"}
          </button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        squares: [a, b, c]
      };
    }
  }
  return null;
}