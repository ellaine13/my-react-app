import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key = {i}
      />
    );
  }

  render() {
    let squaresCollection = []

    for (let rowNum = 0; rowNum < 3; rowNum++) {
      let rowSquares = []

      for (let colNum = 0; colNum < 3; colNum++) {
        rowSquares.push(this.renderSquare(rowNum * 3 + colNum));
      }
      squaresCollection.push(<div key={rowNum} className="board-row">{rowSquares}</div>);
    }

    return (
      <div>
        {squaresCollection}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        col: null,
        row: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      sorterDescending: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const col = this.columnDetect(i);
    const row = this.rowDetect(i);

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        col: col,
        row: row,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  columnDetect(i) {
    let colsModulo = i % 3;

    return colsModulo + 1;
  }

  rowDetect(i) {
    let rowNumber = Math.floor(i/3);

    return rowNumber + 1;
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  orderSort() {
    this.setState({
      sorterDescending: !this.state.sorterDescending,
    });
  }

  renderMove = (move, stepNumber, col, row) => {
    const text = `Позиция. Колонка: ${col}, строка: ${row}`;
    return <div>{move === stepNumber ? (<b>{text}</b>) : text}</div>;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let moves = history.map((step, move) => {
      const desc = move ?
        'Перейти к ходу №' + move :
        'К началу игры';

      const position = move ?
        this.renderMove(move, this.state.stepNumber, history[move].col, history[move].row) :
        null;

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
          {position}
        </li>
      );
    });

    if (this.state.sorterDescending === false) {
      moves = moves.reverse();
    }

    let status;
    if (winner) {
      status = 'Выиграл ' + winner;
    } else {
      status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : '0');
    }

    const sortingOrder = this.state.sorterDescending ? '↓' : '↑';
    let sorter = <button onClick={ () => this.orderSort() }>Отсортировать {sortingOrder}</button>

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <div className="moves-sorter">{sorter}</div>
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
      return squares[a];
    }
  }
  return null;
}
