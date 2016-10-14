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
            <div>
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
    getHtml: function() {
        const binaryStr = Number(this.props.days).toString(2);
        const length = binaryStr.length;

        return {
            __html: binaryStr.split('').reduce((acc, bit, idx) => {
                if (+bit) {
                    const power = length - idx - 1;
                    acc.push(`<span class="pow">2<sup>${power}</sup></span>`);
                }
                return acc;
            }, []).join('<span class="plus">+</span>')
        };
    },
    render() {
        return <div className="powers" dangerouslySetInnerHTML={this.getHtml()}></div>;
    }
});

/**
* Renders a simples "number of days" string.
*/
const DaysDisplay = React.createClass({
    dayOrDays() {
        return this.props.days === 1 ? 'day' : 'days';
    },
    render() {
        return <div className="total">{this.props.days} {this.dayOrDays()}</div>;
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
            <div className="next-in">
                Next fof time in <span className="next-in-time">{this.getTime()}</span>
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
            <div className="days-since">
                {this.state.days} days since we said I do!
            </div>
        );
    }
});

ReactDOM.render(
    <Fofs bridgeDate="2013-02-19 19:30:00-05:00" forestDate="2016-09-24 15:30:00-07:00" />,
    document.getElementById('fofs')
);
