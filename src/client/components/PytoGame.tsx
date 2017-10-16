import * as React from 'react';
import Field from './Field';

const TIMER_INTERVAL = 250;

interface PytoGamePropsInterface {
  width: number,
  height: number,
}

interface PytoGameStateInterface {
  player: {
    shake: number[],
    meat: number,
  },
}

export default class PytoGame extends React.Component<PytoGamePropsInterface, PytoGameStateInterface> {
  private timer: number;

  constructor(props: PytoGamePropsInterface) {
    super(props);
    this.state = {
      player: {
        shake: [0, 1, 2],
        meat: 20,
      },
    };
  }

  onNextTick() {}

  componentDidMount() {
    this.timer = window.setInterval(() => this.onNextTick(), TIMER_INTERVAL);
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
      <div>
        <Field
          width={this.props.width}
          height={this.props.height}
          picture={this.renderPicture()}
        />
      </div>
    );
  }
}
