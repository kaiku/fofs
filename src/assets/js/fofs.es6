const Fofs = React.createClass({
    getInitialState() {
        return {
            // Parse the static date once
            bridgeDate: moment(this.props.bridgeDate),
            forestDate: moment(this.props.forestDate),
        };
    },
    componentDidMount() {
        this.tick();
        this.interval = setInterval(this.tick, 500);
    },
    componentWillUnmount() {
        clearInterval(this.interval);
    },
    tick() {
        const bridgeMs = moment() - this.state.bridgeDate;
        this.setState({
            bridgeMs,
            bridgeDays: Math.floor(moment.duration(bridgeMs).asDays())
        });
    },
    render() {
        return (
            <div className="flex-container">
                <DaysDisplay days={this.state.bridgeDays} />
                <DaysAsPowersOfTwo days={this.state.bridgeDays} />
                <Countdown ms={this.state.bridgeMs} />
                <DaysSince sinceDate={this.state.forestDate} />
            </div>
        );
    }
});

/**
 * Renders days as a sum of powers of two.
 */
const DaysAsPowersOfTwo = React.createClass({
    getHtml() {
        const days = this.props.days;
        const binaryStr = Number(days).toString(2);
        if (isNaN(binaryStr)) {
            return;
        }

        const length = binaryStr.length;
        const lengthOfOnes = binaryStr.split('').reduce((acc, bit, idx) => {
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
    },
    splitToRows(num, max) {
        if (num <= max) {
            return [num];
        } else {
            const top = Math.floor(num / 2);
            const bottom = Math.ceil(num / 2);
            return [top, bottom];
        }
    },
    render() {
        return <div className="powers" dangerouslySetInnerHTML={this.getHtml()}></div>;
    }
});

/**
* Renders a simples "number of days" string.
*/
const DaysDisplay = React.createClass({
    render() {
        return <div className="days">{this.props.days}</div>;
    }
});

/**
* Renders a countdown until the next day change.
*/
const Countdown = React.createClass({
    getTime: function() {
        const dayInMs = 86400000;
        const msUntilNext = dayInMs - (this.props.ms % dayInMs);
        const secUntilNext = Math.ceil(msUntilNext / 1000);
        const hours = Math.floor(secUntilNext / 3600);
        const minutes = Math.floor((secUntilNext - (hours * 3600)) / 60);
        const seconds = secUntilNext - (hours * 3600) - (minutes * 60);

        return [hours, minutes, seconds].map((value) => {
            return (value < 10 ? '0' : '') + value;
        }).join(':');
    },
    render() {
        return (
            <div className="countdown">
                Next fof time in&nbsp;<span>{this.getTime()}</span>
            </div>
        );
    }
});

const DaysSince = React.createClass({
    getInitialState() {
        return {
            since: this.props.sinceDate,
        };
    },
    componentDidMount() {
        this.tick();
        this.interval = setInterval(this.tick, 500);
    },
    componentWillUnmount() {
        clearInterval(this.interval);
    },
    tick() {
        const ms = moment() - this.state.since;
        const days = Math.floor(moment.duration(ms).asDays());
        this.setState({
            days,
        });
    },
    render: function() {
        return (
            <div className="forest">
                <span>{this.state.days}</span>
            </div>
        );
    }
});

ReactDOM.render(
    <Fofs bridgeDate="2013-02-19 19:30:00-05:00" forestDate="2016-09-24 15:30:00-07:00" />,
    document.getElementById('fofs')
);
