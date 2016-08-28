const Fofs = React.createClass({
    getInitialState() {
        return {
            // Parse the static date once
            start: moment(this.props.startDate),
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
        const ms = moment() - this.state.start;
        this.setState({
            ms,
            days: Math.floor(moment.duration(ms).asDays())
        });
    },
    render() {
        return (
            <div>
                <DaysAsPowersOfTwo days={this.state.days} />
                <DaysDisplay days={this.state.days} />
                <Countdown ms={this.state.ms} />
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
                    acc.push('2<sup>' + power + '</sup>');
                }
                return acc;
            }, []).join(' + ')
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
                Next fof time in {this.getTime()}
            </div>
        );
    }
});

const DaysUntil = React.createClass({
    getInitialState() {
        return {
            until: moment(this.props.untilDate, 'YYYY-MM-DD')
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
        const ms = this.state.until - moment();
        const days = Math.max(0, Math.floor(moment.duration(ms).asDays()));
        const word = days === 1 ? 'day' : 'days';
        this.setState({
            days,
            word,
        });
    },
    render: function() {
        return (
            <span className="days-until">
                {this.state.days} {this.state.word}
            </span>
        );
    }
});

ReactDOM.render(
    <Fofs startDate="2013-02-19 19:30:00-05:00" />,
    document.getElementById('fofs')
);

ReactDOM.render(
    <DaysUntil untilDate="2016-09-24" />,
    document.getElementById('countdown-days')
);
