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
      tDate: moment(this.props.tDate),
      cDate: moment(this.props.cDate),
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
    const tMs = now - this.state.tDate;
    const cMs = now - this.state.cDate;
    const bridgeDays = Math.floor(moment.duration(bridgeMs).asDays());
    const forestDays = Math.floor(moment.duration(forestMs).asDays());
    const tDays = Math.floor(moment.duration(tMs).asDays());
    const cDays = Math.floor(moment.duration(cMs).asDays());
    const powersOfTwoHTML = this.getPowersOfTwoHTML(bridgeDays);
    const tPowersOfTwoHTML = this.getPowersOfTwoHTML(tDays);
    const cPowersOfTwoHTML = this.getPowersOfTwoHTML(cDays);
    const countdownString = this.getCountdownString(bridgeMs);

    this.setState({
      bridgeMs,
      bridgeDays,
      forestDays,
      tDays,
      cDays,
      powersOfTwoHTML,
      tPowersOfTwoHTML,
      cPowersOfTwoHTML,
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
        <div className="days fb-one-third">
          {this.state.bridgeDays}
        </div>
        <div className="powers fb-two-thirds" dangerouslySetInnerHTML={this.state.powersOfTwoHTML}></div>
        <div className="k fb-full">
          <div className="days t-days fb-one-sixth">
            {this.state.tDays}
          </div>
          <div className="powers t-powers fb-one-third" dangerouslySetInnerHTML={this.state.tPowersOfTwoHTML}></div>
          <div className="powers c-powers fb-one-third" dangerouslySetInnerHTML={this.state.cPowersOfTwoHTML}></div>
          <div className="days c-days fb-one-sixth">
            {this.state.cDays}
          </div>
        </div>
        <div className="countdown fb-two-thirds">
          <div class="fb-full">Next fof time in</div>
          <div className="time fb-full">{this.state.countdownString}</div>
        </div>
        <div className="forest fb-one-third">
          <span>{this.state.forestDays}</span>
        </div>
      </div>
    );
  }
}

export default App;
