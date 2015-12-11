var assert = require('assert');
var rule = require('../AirHockey/js/rule.js');

describe('AirHockey', function() {
	it('bounce', function() {
		var ball = { //球的相關特性
			x: 10,
			y: 10,
			r: 2,
			dx: 0, //x軸的速度
			dy: 0, //y軸的速度
		};
		var rule = {
			width: 10
		};

		rule.comMove();
		assert.equal(0, 0);
    })
})