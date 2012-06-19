/*Author: Piotrek Lopusiewcz; piotr.lopusiewicz @gmail.com
Many ideas and snippts of code are taken from Seth Ladd's Bad Aliens demo (http://sethladd.com, https://github.com/sethladd/Bad-Aliens */

window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
})();
//Stuff like images and sounds will be stored in Assets object			  
function Assets(paths){


}

//internal clock of the game
function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function() {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;
    
    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}


/*Todo:
-some representation of a track for collision detection
*/
function GameState() {
    
    var that = this;

    var minX = 0, maxX = 400, minY = 0, maxY = 300; 
    
    this.pos =  { x: 200, y: 150 }; 
    this.velocity = {x: 0.1, y: 0.1};
    
    //this.setPosition = function (newPos) {
    //    that.pos.x = Math.max (0, Math.min (that.maxX, newPos.x));
    //    that.pos.y = Math.max (0, Math.min (that.maxY, newPos.y));
    //};
    
    this.update = function (deltaTime, deltavx, deltavy) {
       that.velocity.x += deltavx;
       that.velocity.y += deltavy;
       that.pos.x += that.velocity.x;
       that.pos.y += that.velocity.y;
       
       if (that.pos.x > maxX || that.pos.x < minX){
           that.velocity.x = -(that.velocity.x)*0.8
       }
       if (that.pos.y > maxY || that.pos.y < minY){
           that.velocity.y = -(that.velocity.y)*0.8
       }
       

    };
    
}


function GameEngine (ctx) {
    this.ctx = ctx;
    this.state = new GameState();   
    this.startInput();
}

GameEngine.prototype.draw = function(/*callback*/) {
    
    var SIZE = 20;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = "red";  
    this.ctx.fillRect(
        this.state.pos.x - SIZE, 
        this.state.pos.y - SIZE, 
        SIZE, SIZE);  
};

GameEngine.prototype.loop = function() {
    //this.clockTick = this.timer.tick();
    var deltavx = 0;
    var deltavy = 0;
    var DELTA = 0.05;
    switch (this.key) {
    case 65:
        deltavx -= DELTA;
        break;
    case 68:
        deltavx += DELTA;
        break;
    case 83:
        deltavy += DELTA;
        break;
    case 87:
        deltavy -= DELTA;
        break;        
    }
    this.state.update(0.1, deltavx, deltavy);
    this.draw();
    //this.click = null;
    //this.stats.update();
};

GameEngine.prototype.start = function() {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.startInput = function() {
    var that = this;
        
    window.addEventListener("keydown", function(e) {
        if ([65, 68, 83, 87].indexOf(e.keyCode) != -1){
            that.key = e.keyCode;
            console.log("Key pressed!");
            e.stopPropagation();
            e.preventDefault();
        }
    }, false);
    
    window.addEventListener("keyup", function(e) {
        if ([65, 68, 83, 87].indexOf(e.keyCode) != -1){
            that.key = 0;
            console.log("Key depressed!");
            e.stopPropagation();
            e.preventDefault();
        }
    }, false);
    
}



var canvas = document.getElementById('surface');
var ctx = canvas.getContext('2d');
var game = new GameEngine(ctx);

game.start();