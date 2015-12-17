var assert = require('assert');
var rule = {
	width: 100,
	height: 100,
	ComLevel: 5
};
var ball = { //球的相關特性
	x: 0,
	y: 0,
	r: 0,
	dx: 0, //x軸的速度
	dy: 0 //y軸的速度
};
var player1 = {
	x: 0,
	y: 0,
	score: 0
};
var player2 = {
	x: 0,
	y: 0,
	score: 0
};

describe('Air Hockey', function() {
	describe('comMove', function() {
		it('Com move right', function() {
			player2.x = 10;
			ball.x = 50;
			comMove();
			assert.equal(15, player2.x);
			assert.equal(0, player2.y);
		})
		it('Com move left', function() {
			player2.x = 70;
			ball.x = 50;
			comMove();
			assert.equal(65, player2.x);
		})
		
	})
	
	describe('border', function() {
		it('touch left/right border', function() {
			ball.x = 100;
			ball.r = 100;
			ball.dx = 1;
			border();
			assert.equal(-1, ball.dx);
		})
		it('touch up/down border', function() {
			ball.y = 100;
			ball.r = 100;
			ball.dy = 1;
			ball.x = 10;
			ball.r = 10;
			rule.goalStart = 1;
			border();
			assert.equal(-1, ball.dy);
		})
	})
	
	describe('isGet', function() {
		it('player1 get score', function() {
			ball.y = -5;
			ball.r = 0;
			isGet();
			assert.equal(1, player1.score);
		})
		it('player2 get score', function() {
			ball.y = 1000;
			ball.r = 100;
			isGet();
			assert.equal(1, player2.score);
		})
	})
});

var comMove = function() {
    if (ball.y < rule.height / 2) { //球進入電腦領域時，會以y軸去撞球，球比電腦更靠近球門時，電腦移動速度會比較快
        if (ball.y > player2.y)
            player2.y += rule.ComLevel / 2;
        else
            player2.y -= rule.ComLevel;
    } else if (player2.y > rule.height / 4) { //其他狀況則維持在同一水平
        player2.y -= rule.ComLevel / 5;
    } else if (player2.y < rule.height / 4) {
        player2.y += rule.ComLevel / 5;
    }

    //藉由ComLevel調整電腦的左右移動速度，越困難則移動越快
    player2.dx = rule.ComLevel === 5 ? rule.ComLevel : rule.ComLevel / 3;
    if (ball.y < player2.y && ball.x > player2.x - rule.ComLevel && ball.x < player2.x + rule.ComLevel)
        player2.dx = rule.ComLevel / 3;

    //Com移動
    if (player2.x < ball.x + 10)
        player2.x += player2.dx;
    if (player2.x > ball.x - 10)
        player2.x -= player2.dx;

    //讓Computer不會超出範圍
    if (player2.y > rule.height / 2)
        player2.y = rule.height / 2;
    else if (player2.y < 0)
        player2.y = 0;
    if (player2.x < 0)
        player2.x = 0;
    else if (player2.x > rule.width)
        player2.x = rule.width;
};

var border = function() {
    if (ball.x + ball.r >= rule.width || ball.x - ball.r <= 0) {
        ball.x = ball.x + ball.r >= rule.width ? rule.width - ball.r : 0 + ball.r;
        ball.dx *= -1;
    }

    if (ball.y + ball.r >= rule.height || ball.y - ball.r <= 0) {
        if (ball.x - ball.r < rule.goalStart || ball.x + ball.r > rule.goalEnd) {
            ball.y = ball.y + ball.r >= rule.height ? rule.height - ball.r : 0 + ball.r;
            ball.dy *= -1;
        } else if (ball.x >= rule.goalStart && ball.x <= rule.goalEnd) { //進球門
            ball.dx *= -1;
            isGet();
        }
    }
};

var isGet = function() {
    if (ball.y + ball.r < 0)
        player1.score++;
    if (ball.y - ball.r > rule.height)
        player2.score++;

    if (ball.y + ball.r < 0 || ball.y - ball.r > rule.height) { //某方得分則初始值
        player1.x = rule.width / 2;
        player1.y = rule.height * 3 / 4;
        player2.x = rule.width / 2;
        player2.y = rule.height / 4;
        ball.x = rule.width / 2;
        ball.y = rule.height / 2;
        ball.dx = 0;
        ball.dy = 0;
    }

    if (player1.score == rule.goal || player2.score == rule.goal) //如果到達指定分數，則遊戲結束
        isWin();
};