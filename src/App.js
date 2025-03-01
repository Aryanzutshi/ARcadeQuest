import React, { Component } from 'react';
import TableItem from './tableItem';
import { SIZE } from './constants';
import './styles/App.css';

let removeDec;
class App extends Component {
  diamondPositions = [
    { r: Math.floor(Math.random() * SIZE), c: Math.floor(Math.random() * SIZE) }
  ];
  refItems = [];
  state = { gameOver: false, foundAllDiamond: false, score: SIZE * SIZE };
  componentWillMount() {
    while (this.diamondPositions.length < SIZE) {
      let c = Math.floor(Math.random() * SIZE);
      let r = Math.floor(Math.random() * SIZE);
      if (
        this.diamondPositions.findIndex(pos => pos.r === r && pos.c === c) ===
        -1
      ) {
        this.diamondPositions.push({ r, c });
      }
    }
  }
  _decrementCounter(row, col) {
    this.refItems.forEach(refItem => {
      if (refItem.row !== row && refItem.col !== col) {
        refItem.ref._resetCurrentTile();
      }
    });
    const dec = document.getElementById('decrease');
    dec.style = 'display:inline';
    clearTimeout(removeDec);
    removeDec = setTimeout(() => {
      dec.style = 'display:none';
    }, 500);
    this.setState({ score: this.state.score - 1 });
    if (this.state.score === 0) {
      this.setState({ gameOver: true });
      const prevScore = localStorage.getItem('highScore') || 0;
      if (prevScore < this.state.score)
        localStorage.setItem('highScore', this.state.score - 1);
    }
  }
  _removeRevealedDiamondFromSearchArray(row, col) {
    this.diamondPositions.splice(
      this.diamondPositions.findIndex(
        diamond => diamond.r === row && diamond.c === col
      ),
      1
    );
    if (this.diamondPositions.length === 0) {
      this.setState({ foundAllDiamond: true });
      const prevScore = localStorage.getItem('highScore') || 0;
      if (prevScore < this.state.score)
        localStorage.setItem('highScore', this.state.score - 1);
    }
  }
  _renderRowElements(row) {
    let rowElements = [];
    for (let i = 0; i < SIZE; i++) {
      rowElements.push(
        <td key={i + '' + row}>
          <TableItem
            ref={ref => {
              if (this.refItems.length < SIZE * SIZE)
                this.refItems.push({ row: row, col: i, ref });
            }}
            row={row}
            col={i}
            diamondPositions={this.diamondPositions}
            removeDiamondFromArray={() =>
              this._removeRevealedDiamondFromSearchArray(row, i)
            }
            decrementCounter={() => this._decrementCounter(row, i)}
          />
        </td>
      );
    }
    return rowElements;
  }
  _renderRows() {
    let row = [];
    for (let i = 0; i < SIZE; i++) {
      row.push(<tr key={i}>{this._renderRowElements(i)}</tr>);
    }
    return row;
  }
  _renderTable() {
    return (
      <div>
        <table className="table-board">
          <tbody>{this._renderRows()}</tbody>
        </table>
        <div className="score-board">
          <p className="score-text">
            Your highScore: {localStorage.getItem('highScore') || 0}
          </p>
          <br />
          <p className="score-text">
            Diamonds Left: {this.diamondPositions.length}
          </p>
          <br />
          <p className="score-text">Your score: {this.state.score}</p>
          <p
            hidden={true}
            id={'decrease'}
            className="score-text-score-decrement"
          >
            -1
          </p>
        </div>
      </div>
    );
  }
  _renderGameOver() {
    return (
      <div className="game-over-content">
        <span className="game-over-text">
          {this.state.gameOver
            ? `Game Over`
            : `Congratulations! You have found all the diamonds.`}
        </span>
        <p className="score-text-game-over">Your score: {this.state.score}</p>
        <p>Reload to Play again</p>
        <p>Made with {`<3`} by Aryan</p>
      </div>
    );
  }
  render() {
    return (
      <div>
        <div className="container">
          <div className="jumbotron">
            <h1 style={{ textAlign: 'center' }}>Diamond Sweeper</h1>
            <p style={{ textAlign: 'center' }}>
              They say someone has hidden diamonds behind some tiles of this
              board! Find them all is lowest moves possible. Make high scores
              and challenge your friends as well.
            </p>
          </div>
        </div>
        <div className="container">
          {this.state.gameOver || this.state.foundAllDiamond
            ? this._renderGameOver()
            : this._renderTable()}
        </div>
      </div>
    );
  }
}

export default App;
