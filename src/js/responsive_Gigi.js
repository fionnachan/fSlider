if ($.browser.msie && parseInt($.browser.version, 10) <= 8) {
	jQuery.fx.interval = 1000 / 30;
	var oldIE = true;
} else {
	jQuery.fx.interval = 1000 / 60;
	var oldIE = false;
}

var layout;

function responsive() {
	var _self = this;

	_self.layoutSize = [0, 960];
	_self.layout = ['mobile', 'desktop'];

	_self.window = $(window);
	_self.body = $('body');
	_self.current = _self.layout[_self.layout.length - 1];
	if (oldIE) {
		_self.changeClass(_self.layout[_self.layout.length - 1]);
	} else {
		_self.init();
	}
}
responsive.prototype.init = function () {
	var _self = this;

	_self.changeClass(_self.layout[_self.checkSize()]);
	_self.addEvent();
}
responsive.prototype.addEvent = function () {
	var _self = this;

	_self.window.on('resize', function () {
		_self.changeClass(_self.layout[_self.checkSize()]);
	});
}
responsive.prototype.checkSize = function () {
	var _self = this;

	var _layout = 0;

	for (var i = 0; i < _self.layoutSize.length; i++) {
		if (_self.layoutSize[i] > _self.window.width()) {
			break;
		} else {
			_layout = i;
		}
	}
	return _layout;
}
responsive.prototype.changeClass = function (className) {
	var _self = this;

	if (!_self.body.hasClass(className)) {
		for (var i = 0; i < _self.layoutSize.length; i++) {
			_self.body.removeClass(_self.layout[i]);
		}
		_self.body.addClass(className);
		layout = className;
		$(document).trigger('responsive', className);
	}
}