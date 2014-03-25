var Fofs = function(element, options) {
  this.$element = $(element || 'body');
	this.options  = $.extend({}, Fofs.DEFAULTS, options);
  this.$canvas  = null;
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
  var utc    = Math.floor(new Date().getTime() / 1000),
      sdiff  = utc - this.options.start,
      ddiff  = Math.floor(sdiff / 86400),
      binary = Number(ddiff).toString(2),
      length = binary.length,
      pieces = [],
      output = '';

  for (var i in binary) {
    if (Number(binary[i])) {
      pieces.push('2<sup>' + (length - i - 1) + '</sup>');
    }
  }

  return pieces.join(' + ') + ' <span class="total">(' + ddiff + ' days)</span>';
};
