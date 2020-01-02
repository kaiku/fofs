import React from 'react';
import moment from 'moment';

import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    // Parse the static date once
    this.state = {
      bridgeDate: moment(this.props.bridgeDate),
      forestDate: moment(this.props.forestDate),
    };
    this.tick = this.tick.bind(this);
    this.getPowersOfTwoHTML = this.getPowersOfTwoHTML.bind(this);
    this.splitToRows = this.splitToRows.bind(this);
    this.getCountdownString = this.getCountdownString.bind(this);
  }

  componentDidMount() {
    this.tick();
    this.interval = setInterval(this.tick, 500);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick() {
    const now = moment();
    const bridgeMs = now - this.state.bridgeDate;
    const forestMs = now - this.state.forestDate;
    const bridgeDays = Math.floor(moment.duration(bridgeMs).asDays());
    const forestDays = Math.floor(moment.duration(forestMs).asDays());
    const powersOfTwoHTML = this.getPowersOfTwoHTML(bridgeDays);
    const countdownString = this.getCountdownString(bridgeMs);

    this.setState({
      bridgeMs,
      bridgeDays,
      forestDays,
      powersOfTwoHTML,
      countdownString,
    });
  }

  getPowersOfTwoHTML(days) {
    const binaryStr = Number(days).toString(2);
    if (isNaN(binaryStr)) {
      return;
    }

    const length = binaryStr.length;
    const lengthOfOnes = binaryStr.split('').reduce((acc, bit) => {
      return acc += +bit;
    }, 0);
    const rows = this.splitToRows(lengthOfOnes, 6);
    let classList = [];

    rows.forEach((num) => {
      classList.push(Array(num).fill(`fb-${num}`));
    });
    classList = [].concat(...classList);

    return {
      __html: binaryStr.split('').reduce((acc, bit, idx) => {
        if (+bit) {
          const power = length - idx - 1;
          const cls = classList[acc.length];
          acc.push(`<div class="${cls}">2<sup>${power}</sup></div>`);
        }
        return acc;
      }, []).join('')
    };
  }

  splitToRows(num, max) {
    if (num <= max) {
      return [num];
    } else {
      const top = Math.floor(num / 2);
      const bottom = Math.ceil(num / 2);
      return [top, bottom];
    }
  }

  getCountdownString(ms) {
    const dayInMs = 86400000;
    const msUntilNext = dayInMs - (ms % dayInMs);
    const secUntilNext = Math.ceil(msUntilNext / 1000);
    const hours = Math.floor(secUntilNext / 3600);
    const minutes = Math.floor((secUntilNext - (hours * 3600)) / 60);
    const seconds = secUntilNext - (hours * 3600) - (minutes * 60);

    return [hours, minutes, seconds].map((value) => {
      return (value < 10 ? '0' : '') + value;
    }).join(':');
  }

  render() {
    return (
      <div className="flex-container">
        {/* Bridge days */}
        <div className="days">
          {this.state.bridgeDays}
        </div>
        {/* Powers of two */}
        <div className="powers" dangerouslySetInnerHTML={this.state.powersOfTwoHTML}></div>
        {/* Countdown */}
        <div className="countdown">
          <div>Next fof time in</div>
          <div className="time">{this.state.countdownString}</div>
        </div>
        {/* Forest days */}
        <div className="forest">
          <span>{this.state.forestDays}</span>
        </div>
      </div>
    );
  }
}

export default App;
