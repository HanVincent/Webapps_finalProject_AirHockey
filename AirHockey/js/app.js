var audioElement = document.createElement('audio');
$('#start').click(function() { //開始遊戲之後
    start();
    $("#canvas").on("touchstart touchmove", function(e) { //user觸碰螢幕時
        e.preventDefault();
        movePlayer(e);
    });

    if ($('#music').val() === "1") { //撥放音樂
        audioElement.setAttribute('src', 'Butchers.mp3');
        audioElement.setAttribute('autoplay', 'autoplay');
        audioElement.addEventListener("load", function() {
            audioElement.play();
        }, true);
    } else {
        audioElement.pause();
    }
});