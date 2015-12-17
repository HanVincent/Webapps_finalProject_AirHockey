var rule = {
    width: (window.innerWidth > 0) ? window.innerWidth : screen.width,
    height: (window.innerHeight > 0) ? window.innerHeight : screen.height
};

var ball = { //球的相關特性
    x: rule.width / 2,
    y: rule.height / 2,
    r: rule.width * 0.04,
    dx: 0, //x軸的速度
    dy: 0, //y軸的速度
};

var player1 = new bumper(4 / 3); //新增player1，player2
var player2 = new bumper(4);
