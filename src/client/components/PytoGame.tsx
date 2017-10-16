import * as React from 'react';
import { last } from 'lodash';
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
    meat: number,
    step: number,
    direction: 'v' | 'h',
  },
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
        meat: 30,
        step: 1,
        direction: 'h',
      },
    };
    this.square = this.props.width * this.props.height;

    this.onKeyPress = this.onKeyPress.bind(this);
  }

  onKeyPress(event: React.KeyboardEvent<any>) {
    switch (event.which) {
      case KeyCodes.DOWN:
        this.setState({
          ...this.state,
          player: {
            ...this.state.player,
            step: this.props.width,
            direction: 'v',
          },
        });
        break;
      case KeyCodes.UP:
        this.setState({
          ...this.state,
          player: {
            ...this.state.player,
            step: -this.props.width,
            direction: 'v',
          },
        });
        break;
      case KeyCodes.LEFT:
        this.setState({
          ...this.state,
          player: {
            ...this.state.player,
            step: -1,
            direction: 'h',
          },
        });
        break;
      case KeyCodes.RIGHT:
        this.setState({
          ...this.state,
          player: {
            ...this.state.player,
            step: 1,
            direction: 'h',
          },
        });
    }
  }

  onNextTick() {
    // is move available
    // move
    this.moveShake();
  }

  moveShake() {
    const shake = this.state.player.shake;
    const step = this.state.player.step;
    const shakeHead = last(shake) as number;

    const move = ({
      h: (head: number) => {
        const verticalOffset = Math.floor(head / this.props.width) * this.props.width;
        return verticalOffset + mod(head + step, this.props.width);
      },
      v: (head: number) => {
        return mod(head + step, this.square);
      },
    })[this.state.player.direction];

    const nextPosition = move(shakeHead);

    const newShake = [...shake.slice(1), nextPosition];

    this.setState({
      ...this.state,
      player: {
        ...this.state.player,
        shake: newShake,
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

    field[this.state.player.meat] = 'meat';

    this.state.player.shake.forEach(part => {
      field[part] = 'shake';
    });

    return field;
  }

  render() {
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
}
