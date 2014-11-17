var Fofs = function(element, options) {
  this.$element = $(element || 'body');
  this.options  = $.extend({}, Fofs.DEFAULTS, options);
  this.value    = null;
  this.init();
};

Fofs.DEFAULTS = {
  start: 1361320200
};

Fofs.prototype.constructor = Fofs;

Fofs.prototype.init = function() {
  setInterval($.proxy(this.draw, this), 1000);
  this.draw();
};

Fofs.prototype.draw = function() {
  var value = this.calculate();

  if (this.value === value) return;
  this.value = value;
  this.$element.html(this.value);
};

/**
 * @returns {string}
 */
Fofs.prototype.calculate = function() {
  var dayDiff = this.getDayDiff(),
      timeUntilNext = this.getTimeUntilNextDayString(),
      binary = Number(dayDiff).toString(2),
      length = binary.length,
      pieces = [];

  for (var i in binary) {
    if (Number(binary[i])) {
      pieces.push('2<sup>' + (length - i - 1) + '</sup>');
    }
  }

  var str = '';
  str += pieces.join(' + ');
  str += ' <div class="total">' + dayDiff + ' days</div>';
  str += ' <div class="next-in">Next fof time in ' + timeUntilNext + '</div>';
  return str;
};

/**
 * @returns {number}
 */
Fofs.prototype.getDayDiff = function() {
  var secondsDiff = this.getSecondsDiff();
  return Math.floor(secondsDiff / 86400);
};

/**
 * @returns {number}
 */
Fofs.prototype.getSecondsDiff = function() {
  var utc = Math.floor(new Date().getTime() / 1000);
  return utc - this.options.start;
};

/**
 * @returns {string}
 */
Fofs.prototype.getTimeUntilNextDayString = function() {
  var totalSecUntilNext = this.getSecondsUntilNextDay(),
      hoursUntilNext = Math.floor(totalSecUntilNext / 3600),
      minUntilNext = Math.floor((totalSecUntilNext - (hoursUntilNext * 3600)) / 60),
      secUntilNext = totalSecUntilNext - (hoursUntilNext * 3600) - (minUntilNext * 60);

  return this.padWithZero(hoursUntilNext) + ':' +
    this.padWithZero(minUntilNext) + ':' +
    this.padWithZero(secUntilNext);
};

/**
 * @returns {number}
 */
Fofs.prototype.getSecondsUntilNextDay = function() {
  var secondsDiff = this.getSecondsDiff();
  // Seconds in day minus number of seconds elapsed in this day.
  return 86400 - (secondsDiff % 86400);
};

/**
 * @param {number} val
 * @return {string}
 */
Fofs.prototype.padWithZero = function(val) {
  return val < 10 ? ('0' + val) : ('' + val);
};
