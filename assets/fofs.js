(function(moment) {
  'use strict';

  var Fofs = React.createClass({
    componentWillMount: function() {
      // Parse the static date once
      this.setState({start: moment(this.props.startDate)});
    },
    componentDidMount: function() {
      this.tick();
      this.interval = setInterval(this.tick, 1000);
    },
    componentWillUnmount: function() {
      clearInterval(this.interval);
    },
    tick: function() {
      var ms = moment() - this.state.start;
      this.setState({
        ms: ms,
        days: Math.floor(moment.duration(ms).asDays())
      });
    },
    render: function() {
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
  var DaysAsPowersOfTwo = React.createClass({
    getHtml: function() {
      var binaryStr = Number(this.props.days).toString(2),
          length = binaryStr.length;

      return {
        __html: binaryStr.split('').reduce(function(acc, bit, idx) {
          if (+bit) {
            var power = length - idx - 1;
            acc.push('2<sup>' + power + '</sup>');
          }
          return acc;
        }, []).join(' + ')
      };
    },
    render: function() {
      return <div className="powers" dangerouslySetInnerHTML={this.getHtml()}></div>;
    }
  });

  /**
   * Renders a simples "number of days" string.
   */
  var DaysDisplay = React.createClass({
    dayOrDays: function() {
      return this.props.days === 1 ? 'day' : 'days';
    },
    render: function() {
      return <div className="total">{this.props.days} {this.dayOrDays()}</div>;
    }
  });

  /**
   * Renders a countdown until the next day change.
   */
  var Countdown = React.createClass({
    getTime: function() {
      var dayInMs = 86400000,
          msUntilNext = dayInMs - (this.props.ms % dayInMs),
          duration = moment.duration(msUntilNext),
          hours = Math.floor(duration.asHours()),
          minutes = Math.floor(duration.subtract(hours, 'h').asMinutes()),
          seconds = Math.floor(duration.subtract(minutes, 'm').asSeconds());

      return [hours, minutes, seconds].map(function(value) {
          return (value < 10 ? '0' : '') + value;
        }).join(':');
    },
    render: function() {
      return (
        <div className="next-in">
          Next fof time in {this.getTime()}
        </div>
      );
    }
  });

  React.render(
    <Fofs startDate="2013-02-19 19:30:00-05:00" />,
    document.getElementById('fofs')
  );
}(window.moment));
