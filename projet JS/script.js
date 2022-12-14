window.onload = function(){
  var canvasWidth = 900;
  var canvasHeight = 600;
  var blockSize = 30;
  var ctx;
  var delay = 100;
  var Snakee;
  //var blockColor = '';
  var applee;
  var widthInBlocks = canvasWidth/blockSize;
  var heighInBlocks = canvasHeight/blockSize;
  var score;
  var timeout;

  init();

  // 1
  function init(){
    var canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "30px solid gray";
    canvas.style.margin = "50px auto";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#ddd";
    document.body.appendChild(canvas);

    ctx = canvas.getContext('2d');

    //blockColor = '#ff0000';
    let lists = [ [7, 4], [6, 4], [5, 4], [4, 4], [3,4], [2,4]]

    Snakee = new Snake(lists, "right"); // 2
    applee = new Apple([10,10]);
    score = 0;
    
    refreshCanvas();
  }

  // 3
  function refreshCanvas(){
    Snakee.advance();
    if(Snakee.checkCollision()){
      gameOver();
    } else {
      if(Snakee.isEatingApple(applee)){
        Snakee.ateApple = true;
        do
        {
          score++;
          applee.setNewPosition();
        }
        while(applee.isOnSnake(Snakee))
        }
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      drawScore();
      Snakee.draw();
      applee.draw();
      timeout = setTimeout(refreshCanvas,delay);
    }
  }

  // 5
  function gameOver (){
    ctx.save();
    ctx.font = "bold 70px sans-serif"
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    var centerX = canvasWidth / 2;
    var centerY = canvasHeight / 2;
    ctx.strokeText("Game Over", centerX, centerY - 180);
    ctx.fillText("Game Over", centerX, centerY - 180);
    ctx.font = "bold 30px sans-serif"
    ctx.strokeText("Appuyez sur la touche espace pour rejouer", centerX, centerY - 120);
    ctx.fillText("Appuyez sur la touche espace pour rejouer", centerX, centerY - 120);
    ctx.restore();
  }

  function restart(){
    let lists = [ [7, 4], [6, 4], [5, 4], [4, 4], [3,4], [2,4]]
    Snakee = new Snake(lists, "right");
    applee = new Apple([10,10]);
    score = 0;
    clearTimeout(timeout);
    refreshCanvas();
  }

  function drawScore(){
    ctx.save();
    ctx.font = "bold 200px sans-serif"
    ctx.fillStyle = "gray";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var centerX = canvasWidth / 2;
    var centerY = canvasHeight / 2;
    ctx.fillText(score.toString(), centerX,centerY);
    ctx.restore();
  }

  function drawBlock(ctx, position){
    var x = position[0] * blockSize;
    var y = position[1] * blockSize;
    ctx.fillRect(x, y, blockSize, blockSize);
  }

  // body => [ [6, 4], [5, 4], [4, 4] ]
  function Snake(body, direction){
    this.body = body;
    this.direction = direction;
    this.ateApple = false;

    this.advance = function(){
        var nextPosition = this.body[0].slice();
        switch(this.direction)
        {
          case "left":
            nextPosition[0] -= 1;
            break;
          case "right":
              nextPosition[0] += 1;
              break;
          case "down":
              nextPosition[1] += 1;
              break;
          case "up":
              nextPosition[1] -= 1;
              break;
          default:
              throw("invalid direction");
        }
        this.body.unshift(nextPosition);

        if(!this.ateApple)
          this.body.pop();
        else
          this.ateApple = false;
      };

    // 4
    this.draw = function(){
      ctx.save();
      ctx.fillStyle = "#f00020";
      //ctx.fillStyle = blockColor;

      this.body.forEach(function (b){
        drawBlock(ctx, b);
      });

      ctx.restore();
      
      this.setDirection = function(newDirection){
        var allowedDirections;
        switch(this.direction){
          case "left":
          case "right":
              allowedDirections = ["up", "down"];
            break;
          case "down":
          case "up":
              allowedDirections = ["left", "right"];
            break;
          default:
            throw("invalid direction");
        }
        if(allowedDirections.indexOf(newDirection) > -1)
        {
          this.direction = newDirection
        }
      }
    };
          this.checkCollision = function(){
              var wallCollision = false;
              var snakeCollision = false;
              var head = this.body[0];
              var rest = this.body.slice(1);
              var snakeX = head[0];
              var snakeY = head[1];
              var minX = 0;
              var minY = 0;
              var maxX = widthInBlocks - 1;
              var maxY = heighInBlocks - 1;
              var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
              var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

              if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
                wallCollision = true;
              }

              for(var i = 0; i< rest.lenght ; i++)
              {
                if(snakeX === rest[i][0] && snakeY ===[i][1] )
                {
                  snakeCollision = true;
                }
              }

                return wallCollision || snakeCollision;

            };
              this.isEatingApple = function(appleToEat)
              {
                var head = this.body[0];
                if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                  return true;
                else
                  return false;
              };
          }

    function Apple(position){
      this.position = position;
      this.draw = function(){
        ctx.save();
        ctx.fillStyle = "#33cc33";
        ctx.beginPath();
        var radius = blockSize/2;
        var x = this.position[0]*blockSize + radius;
        var y = this.position[1]*blockSize + radius;
        ctx.arc(x,y, radius, 0, Math.PI*2, true);
        ctx.fill();
        ctx.restore();
      };

      this.setNewPosition = function(){
        var newX = Math.round(Math.random() * (widthInBlocks - 1));
        var newY = Math.round(Math.random() * (heighInBlocks - 1));
        this.position = [newX, newY];
      };

      this.isOnSnake = function(snakeToCheck){
        var isOnSnake = false;
        for (var i = 0 ; i < snakeToCheck.body.lenght; i++)
        {
          if(this.position[x] === snakeToCheck.body[i][0] && this.position[y] === snakeToCheck.body[i][1])
          {
            isOnSnake = true;
          }
        }
        return isOnSnake;
      };
    }

    document.onkeydown = function handleKeyDown(e){
      var key = e.code;
      //alert (key);
      var newDirection;
      switch(key){
        case "ArrowLeft":
            newDirection = "left"
            break;
        case "ArrowUp":
            newDirection = "up"
            break;
        case "ArrowRight":
            newDirection = "right"
            break;  
        case "ArrowDown":
            newDirection = "down"
            break;
        case "Space":
            restart();
            return;
        default:
            return;
      }
      Snakee.setDirection(newDirection);
    }
  }


  // document.onkeydown = function handleKeyDown(e)
  // {
  //   var key = e.code;
  //   var newDirection;
  //   switch(key)
  //   {
  //     case "ArrowLeft":
  //         newDirection = "left"
  //         break;
  //     case "ArrowUp":
  //         newDirection = "up"
  //         break;
  //     case "ArrowRight":
  //         newDirection = "right"
  //         break;  
  //     case "ArrowDown":
  //         newDirection = "down"
  //         break;
  //     default:
  //         return;
  //   }
  //   Snakee.setDirection(newDirection);
  // }

  // function snake(body)
  // {
  //   this.body = body;
  //   this.draw = function()
  //   {
  //     ctx.save();
  //     ctx.fillStyle = "#ff0000";

  //     for(var i = 0; i < this.body.lenght; i++)
  //     {
  //       drawBlock(ctx, this.body[i]);
  //     }
  //     ctx.restore();
  //   };
  // }