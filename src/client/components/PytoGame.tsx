import * as React from 'react';
import { last, includes } from 'lodash';
import * as numeral from 'numeral';
import Field from './Field';
import { mod } from '../../shared/util/math';

const TIMER_INTERVAL = 250;

interface PytoGamePropsInterface {
  width: number,
  height: number,
}

interface PytoGameStateInterface {
  player: {
    shake: number[],
    egg: number,
    step: number,
    direction: 'v' | 'h',
  },
  gameState: 'play' | 'over' | 'pause',
  pressedKey: number | null,
}

enum KeyCodes {
  UP = 38,
  DOWN = 40,
  LEFT = 37,
  RIGHT = 39,
  SPACE = 32,
}

export default class PytoGame extends React.Component<PytoGamePropsInterface, PytoGameStateInterface> {
  private timer: number;
  private square: number;

  constructor(props: PytoGamePropsInterface) {
    super(props);

    this.state = {
      player: {
        shake: [0, 1, 2],
        egg: 3,
        step: 1,
        direction: 'h',
      },
      gameState: 'play',
      pressedKey: null,
    };
    this.square = this.props.width * this.props.height;

    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentDidMount() {
    this.timer = window.setInterval(
      () => this.onNextTick(),
      TIMER_INTERVAL,
    );
    document.addEventListener('keydown', this.onKeyPress, false);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    document.removeEventListener('keydown', this.onKeyPress);
  }

  onKeyPress(event: KeyboardEvent) {
    this.setState({ pressedKey: event.keyCode });
  }

  getShakeHead(): number {
    return last(this.state.player.shake) as number;
  }

  setStepAndDirection(step: number, direction: PytoGameStateInterface['player']['direction']) {
    if (direction === this.state.player.direction) {
      // no instant turn
      return;
    }

    this.setState({
      ...this.state,
      player: { ...this.state.player, step, direction },
    });
  }

  onNextTick() {
    this.reactOnPressedKey();

    if (this.state.gameState !== 'play') {
      return;
    }

    const nextPosition = this.calculateNextPosition();

    if (nextPosition === this.state.player.egg) {
      this.extendShake(nextPosition);
      return this.placeEgg();
    }

    if (includes(this.state.player.shake, nextPosition)) {
      return this.setState({ gameState: 'over' });
    }

    return this.moveShake(nextPosition);
  }

  reactOnPressedKey() {
    switch (this.state.pressedKey) {
      case null:
        return;
      case KeyCodes.DOWN:
        this.setStepAndDirection(this.props.width, 'v');
        break;
      case KeyCodes.UP:
        this.setStepAndDirection(-this.props.width, 'v');
        break;
      case KeyCodes.RIGHT:
        this.setStepAndDirection(1, 'h');
        break;
      case KeyCodes.LEFT:
        this.setStepAndDirection(-1, 'h');
        break;
      case KeyCodes.SPACE:
        this.pauseGame();
        break;
    }
    this.setState({ pressedKey: null });
  }

  pauseGame() {
    const gameState = this.state.gameState;

    if (gameState === 'over') {
      return;
    }

    this.setState({
      gameState: (gameState === 'pause' ? 'play' : 'pause'),
    })
  }

  calculateNextPosition(): number {
    const step = this.state.player.step;
    const shakeHead = this.getShakeHead();

    const move = ({
      h: (head: number) => {
        const verticalQuotient = Math.floor(head / this.props.width) * this.props.width;
        return verticalQuotient + mod(head + step, this.props.width);
      },
      v: (head: number) => {
        return mod(head + step, this.square);
      },
    })[this.state.player.direction];

    return move(shakeHead);
  }

  moveShake(nextPosition: number) {
    const shake = this.state.player.shake;
    const newShake = [...shake.slice(1), nextPosition];

    this.setState({
      ...this.state,
      player: { ...this.state.player, shake: newShake },
    });
  }

  extendShake(nextPosition: number) {
    const shake = this.state.player.shake;
    const newShake = [...shake, nextPosition];

    this.setState({
      ...this.state,
      player: { ...this.state.player, shake: newShake },
    });
  }

  getNextEggPosition() {
    let pos;

    do {
      pos = Math.floor(Math.random() * this.square)
    } while (includes(this.state.player.shake, pos));

    return pos;
  }

  placeEgg() {
    this.setState({
      ...this.state,
      player: {
        ...this.state.player,
        egg: this.getNextEggPosition(),
      },
    });
  }

  renderPicture() {
    const lineSize = this.props.width * this.props.height;
    const field = new Array<string>(lineSize).fill('empty');

    field[this.state.player.egg] = 'egg';

    this.state.player.shake.forEach(part => {
      field[part] = 'shake';
    });

    return field;
  }

  render() {
    const scoreView = (
      <div className="score">
        Score: {numeral(this.state.player.shake.length - 3).format('0000')}
      </div>
    );

    if (this.state.gameState === 'over') {
      return (
        <div>
          <div className="field">
            <div className="message red">
              GAME OVER
            </div>
          </div>
          {scoreView}
        </div>
      );
    }

    if (this.state.gameState === 'pause') {
      return (
        <div>
          <div className="field">
            <div className="message">
              PAUSED
            </div>
          </div>
          {scoreView}
        </div>
      );
    }

    return (
      <div>
        <Field
          width={this.props.width}
          height={this.props.height}
          picture={this.renderPicture()}
        />
        {scoreView}
      </div>
    );

  }
}
