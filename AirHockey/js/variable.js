var rule = {
    width: (window.innerWidth > 0) ? window.innerWidth : screen.width,
    height: (window.innerHeight > 0) ? window.innerHeight : screen.height
};

var ball = { //�y�������S��
    x: rule.width / 2,
    y: rule.height / 2,
    r: rule.width * 0.04,
    dx: 0, //x�b���t��
    dy: 0, //y�b���t��
};

var player1 = new bumper(4 / 3); //�s�Wplayer1�Aplayer2
var player2 = new bumper(4);
