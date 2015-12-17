'use strict';

var bumper = function(h) { //新增球盤物件的function，傳入的h用來放置位置
    this.x = rule.width / 2;
    this.y = rule.height / h;
    this.r = rule.width * 0.05;
    this.dx = 0; //用來設置Computer的移動速度
    this.dy = 0;
    this.score = 0; //得分數
    this.bounce = function() { //確認是否撞到球，有則球反彈
        if ((ball.x - this.x) * (ball.x - this.x) + (ball.y - this.y) * (ball.y - this.y) <= (ball.r + this.r) * (ball.r + this.r)) {
            ball.dx = (ball.x - this.x) / (ball.r + this.r) * ball.s; //this.dx*10;
            ball.dy = (ball.y - this.y) / (ball.r + this.r) * ball.s; //this.dy*10;

            if ((ball.x - this.x) * (ball.x - this.x) + (ball.y - this.y) * (ball.y - this.y) < (ball.r + this.r) * (ball.r + this.r)) {
                this.x -= 1;
                this.y -= 1;
            }
        }
    };
};

var start = function() {
    player1.x = rule.width / 2;
    player1.y = rule.height * 3 / 4;
    player2.x = rule.width / 2;
    player2.y = rule.height / 4;
    ball.s = $("#speed").val();
    ball.f = 1 - $("#friction").val() / 1000;
    rule.model = $("[name=player]:checked").val();
    rule.goal = $("#goal").val();
    rule.goalStart = rule.width * 0.3;
    rule.goalEnd = rule.width * 0.7;
    rule.ComLevel = $("[name=level]:checked").val();
    rule.interval = setInterval(drawArea, 1); //每3ms重刷一次畫布
}
var movePlayer = function(e) {
    if (rule.model === "1") { //1P則只能控制下半部分
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        if (touch.pageY > rule.height / 2) {
            player1.x = touch.pageX;
            player1.y = touch.pageY;
        }
    } else { //2P，利用迴圈將每個touch進行判斷
        for (var i = 0; i < e.originalEvent.touches.length; i++) {
            var touch = e.originalEvent.touches[i] || e.originalEvent.changedTouches[i];
            if (touch.pageY > rule.height / 2) {
                player1.x = touch.pageX;
                player1.y = touch.pageY;
            } else {
                player2.x = touch.pageX;
                player2.y = touch.pageY;
            }
        }
    }
};

//1P時才會call
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

//邊界，球碰到則反彈
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

//進球門，得分
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

var isWin = function() { //獲勝則停止Interval且歸零分數，並回到主頁面
    drawArea();
    clearInterval(rule.interval);
    if (player1.score > player2.score)
        alert("Player1 win!");
    else
        rule.model === "1" ? alert("Computer win!") : alert("Player2 win!");
    player1.score = 0;
    player2.score = 0;

    history.back(); //返回主頁面
};

//畫布
var drawArea = function() {
    var ctx = $('#canvas')[0].getContext("2d");
    ctx.canvas.width = rule.width;
    ctx.canvas.height = rule.height;

    //ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = "#0ff";
    ctx.fill();

    //player1
    ctx.beginPath();
    ctx.arc(player1.x, player1.y, player1.r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = "#0f0";
    ctx.fill();

    //player2
    ctx.beginPath();
    ctx.arc(player2.x, player2.y, player2.r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    //score
    ctx.font = "30px Arial";
    ctx.fillStyle = "#f00";
    ctx.fillText(player1.score, 0, rule.height);
    ctx.fillText(player2.score, 0, 30);

    //move ball
    ball.dx *= ball.f;
    ball.dy *= ball.f;
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (rule.model === "1") //1P
        comMove();

    border();
    player1.bounce(); //確認球和球盤是否碰撞
    player2.bounce();
};