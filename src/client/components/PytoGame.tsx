import * as React from 'react';
import { last, includes } from 'lodash';
import Field from './Field';
import { mod } from '../../shared/util/math';

const TIMER_INTERVAL = 150;

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
  gameState: 'play' | 'over'
}

enum KeyCodes {
  UP = 38,
  DOWN = 40,
  LEFT = 37,
  RIGHT = 39
}

export default class PytoGame extends React.Component<PytoGamePropsInterface, PytoGameStateInterface> {
  private timer: number;
  private square: number;

  constructor(props: PytoGamePropsInterface) {
    super(props);

    this.state = {
      player: {
        shake: [0, 1, 2],
        egg: 30,
        step: 1,
        direction: 'h',
      },
      gameState: 'play',
    };
    this.square = this.props.width * this.props.height;

    this.onKeyPress = this.onKeyPress.bind(this);
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

  onKeyPress(event: React.KeyboardEvent<any>) {
    switch (event.which) {
      case KeyCodes.DOWN:
        return this.setStepAndDirection(this.props.width, 'v');
      case KeyCodes.UP:
        return this.setStepAndDirection(-this.props.width, 'v');
      case KeyCodes.RIGHT:
        return this.setStepAndDirection(1, 'h');
      case KeyCodes.LEFT:
        return this.setStepAndDirection(-1, 'h');
    }
  }

  onNextTick() {
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

  calculateNextPosition(): number {
    const shake = this.state.player.shake;
    const step = this.state.player.step;
    const shakeHead = last(shake) as number;

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

  placeEgg() {
    let pos;

    do {
      pos = Math.floor(Math.random() * this.square)
    } while (includes(this.state.player.shake, pos));

    this.setState({
      ...this.state,
      player: {
        ...this.state.player,
        egg: pos,
      },
    });
  }

  componentDidMount() {
    this.timer = window.setInterval(
      () => this.onNextTick(),
      TIMER_INTERVAL,
    );
  }

  componentWillUnmount() {
    clearInterval(this.timer);
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
    if (this.state.gameState === 'play') {
      return (
        <div tabIndex={0} onKeyDown={this.onKeyPress}>
          <Field
            width={this.props.width}
            height={this.props.height}
            picture={this.renderPicture()}
          />
        </div>
      );
    }

    return (
      <div>

        <div className="field">
          <div className="gameover">GAME OVER</div>
        </div>
      </div>
    );
  }
}
