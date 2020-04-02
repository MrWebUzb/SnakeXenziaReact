import React, { Component } from 'react';
import Snake from './Snake';
import Food from './Food';
import Score from './Score';

const getRandomCoordinates = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  let y = Math.floor((Math.random()*(max-min+1)+min)/2)*2;

  return [x, y];
}

let xDown = null;
let yDown = null;

const initialState = {
  food: getRandomCoordinates(),
  score: 0,
  speed: 150,
  oldDirection: 'RIGHT',
  direction: 'RIGHT',
  snakeDots: [
    [0, 0],
    [2, 0],
    [4, 0],
    [6, 0],
    [8, 0],
    [10, 0],
    [12, 0],
    [14, 0],
    [16, 0],
    [18, 0],
    [20, 0],
    [22, 0],
    [24, 0]
  ]
}

class App extends Component {
  state = initialState;

  componentDidMount() {
    setInterval(this.moveSnake, this.state.speed);
    document.onkeydown = this.onKeyDown;
    document.addEventListener('touchstart', this.handleTouchStart, false);
    document.addEventListener('touchmove', this.handleTouchMove, false);
  }

  componentDidUpdate() {
    this.checkIfOutOfBorder();
    this.checkIfCollapsed();
    this.checkIfEat();
  }

  onKeyDown = (e) => {
    e = e || window.event;

    switch (e.keyCode) {
      case 38:
        this.setState({direction: 'UP'});
        break;
      case 40:
        this.setState({direction: 'DOWN'});
        break;
      case 37:
        this.setState({direction: 'LEFT'});
        break;
      case 39:
        this.setState({direction: 'RIGHT'});
        break;
    }
  }

  getTouches = (e) => {
    return e.touches || e.originalEvent.touches;
  }

  handleTouchStart = (e) => {
    const firstTouch = this.getTouches(e)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
  }

  handleTouchMove = (e) => {
    if (!xDown || !yDown) {
      return;
    }

    var xUp = e.touches[0].clientX;
    var yUp = e.touches[0].clientY;


    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        this.setState({
          direction: "LEFT"
        });
      } else {
        this.setState({
          direction: "RIGHT"
        });
      }
    } else {
      if (yDiff > 0) {
        this.setState({
          direction: "UP"
        });
      } else {
        this.setState({
          direction: "DOWN"
        });
      }
    }

    xDown = null;
    yDown = null;
  }

  moveSnake = () => {
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];

    this.detectDirection();

    switch (this.state.direction) {
      case 'RIGHT':
        head = [head[0] + 2, head[1]];
        break;
      case 'LEFT':
        head = [head[0] - 2, head[1]];
        break;
      case 'DOWN':
        head = [head[0], head[1] + 2];
        break;
      case 'UP':
        head = [head[0], head[1] - 2];
        break;
    }

    dots.push(head);
    dots.shift();

    this.setState({
      snakeDots: dots
    });
  }

  detectDirection = () => {
    let curr = this.state.direction;
    let old = this.state.oldDirection;

    if (curr == "LEFT" && old == "RIGHT"
      || curr == "RIGHT" && old == "LEFT"
      || curr == "UP" && old == "DOWN"
      || curr == "DOWN" && old == "UP") {
      this.setState({
        direction: old
      })
    } else {
      this.setState({
        oldDirection: curr
      });
    }
  }

  checkIfOutOfBorder = () => {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];

    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      this.onGameOver();
    }
  }

  onGameOver = () => {
    alert('Game Over!');
    this.setState(initialState);
  }

  checkIfCollapsed = () => {
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];

    dots.pop();

    dots.forEach(dot => {
      if (head[0] == dot[0] && head[1] == dot[1]) {
        this.onGameOver();
      }
    })
  }

  checkIfEat = () => {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let food = this.state.food;

    if (head[0] == food[0] && head[1] == food[1]) {
      this.setState({
        food: getRandomCoordinates(),
        score: this.state.score + 1
      });

      this.enlargeSnake();
      this.increaseSpeed();
    }
  }

  enlargeSnake = () => {
    let newDots = [...this.state.snakeDots];
    newDots.unshift([]);
    this.setState({
      snakeDots: newDots
    });
  }

  increaseSpeed = () => {
    if (this.state.speed > 50) {
      this.setState({
        speed: this.state.speed - 5
      })
    } else {
      this.setState({
        speed: 50
      })
    }
  }

  render() {
    return (
      <div className="game-area">
        <Score score={this.state.score}/>
        <Snake snakeDots={this.state.snakeDots}/>
        <Food dot={this.state.food} />
      </div>
    );
  }
}

export default App;
