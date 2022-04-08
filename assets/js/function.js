const containerTV = document.querySelector('.containerTV');

/* Creation canvas */
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
canvas.classList.add('windowsGame')
containerTV.appendChild(canvas);
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;
const ctx = canvas.getContext("2d");
let collision = false;
let score = 0;
let life = 3;
let level = 0;
const snakeHeight = 20;  // taille d'un bloc du serpent
let appleTime = 0;
const appleTimeMax = 75;
let codeTouche = 0;
let pause = false;

/* Number block in canvas */

let numberBlockX = canvasWidth / snakeHeight;
let numberBlockY = canvasHeight / snakeHeight;

/* Proporty Snake */

const snakeColor = "blue";
let xPosSnake = Math.trunc(Math.random()*numberBlockX) * snakeHeight;
let yPosSnake = Math.trunc(Math.random()*numberBlockY) * snakeHeight;
let moveX = 0;
let moveY = 0;
let heightBodySnake = 5;
let bodySnake = [];


/* Property Apple */

const appleColor = "red";
let xApple = Math.trunc(Math.random()*numberBlockX) * snakeHeight;
let yApple = Math.trunc(Math.random()*numberBlockY) * snakeHeight;
const appleRay = snakeHeight / 2;

// Property bonus

const bonusColor = 'green';
let xBonus = Math.trunc(Math.random()*numberBlockX) * snakeHeight;
let yBonus = Math.trunc(Math.random()*numberBlockY) * snakeHeight;
let timeBonus = 0;
let showBonus = false;


/* Detection collision */

function detectionCollision(){
    // 1 : the snake bites
    if(bodySnake.length > 5) {
        for (let i = 0; i < bodySnake.length - 1; i++) {
            if(bodySnake[i].x === bodySnake[bodySnake.length - 1].x && bodySnake[i].y === bodySnake[bodySnake.length - 1].y){
                collision = true;
                break;
            }            
        }
    }
    // 2 : the snake move out canvas
    if(xPosSnake < 0 || yPosSnake < 0 || xPosSnake + snakeHeight > canvasWidth || yPosSnake + snakeHeight > canvasHeight){
        collision = true;
    }
}

function appleEat(){
    if (xApple == xPosSnake && yApple == yPosSnake) {
        initialisationApplePosition();
        score += 20 + 5*bodySnake.length;
        console.log(score);
        heightBodySnake += 1;
        scoreUpdated();
        levelUP();
        levelUpdate();
        appleTime = 0;
    }
    else if (appleTime === appleTimeMax){
        initialisationApplePosition()
        appleTime = 0;
    }
    else{
        appleTime++
    }
}

/* Management position */

// Snake position

function snakePositionManagement(){
    xPosSnake += moveX * snakeHeight;
    yPosSnake += moveY * snakeHeight;
    bodySnake.push({x : xPosSnake, y : yPosSnake});
    while(bodySnake.length > heightBodySnake){
        bodySnake.shift();
    }
}

// Bonus position

function bonusPositionManagement(){
    if(timeBonus++ > 50){
        timeBonus = 0;
        // on peut afficher le bonus
        if(Math.random() > 0.8){
            // on affiche le bonus
            initialisationBonusPosition();
            drawBonus();
            showBonus = true;
        }
        else{
            // on affiche pas le bonus
            xBonus = 1000;
            yBonus = 1000;
            showBonus = false;
        }
    }
    if(showBonus){
        drawBonus();
    }
    if (xBonus == xPosSnake && yBonus == yPosSnake){
        life++;
        xBonus = 1000;
        yBonus = 1000;
        showBonus = false;
    }
}

/* Function to drawing*/

// Drawing Snake

function drawSnake(){
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    snakePositionManagement();
    ctx.fillStyle = snakeColor;
    for (let i = 0; i < bodySnake.length; i++) {
        ctx.fillRect(bodySnake[i].x, bodySnake[i].y, snakeHeight, snakeHeight);
    }
}

// Drawing Apple

function drawApple(){
    ctx.beginPath();
    ctx.arc(xApple + appleRay, yApple + appleRay, appleRay, 0, 2*Math.PI);
    ctx.fillStyle = appleColor;
    ctx.fill();
    ctx.font = '15px Arial';
    ctx.fillStyle = 'green';
    ctx.fillText('V', xApple + 3, yApple + 3);
    ctx.closePath();
}

// Drawing bonus

function drawBonus(){
    ctx.font = "19px Arial";
    ctx.fillStyle = bonusColor;
    ctx.fillText('💚', xBonus - 3, yBonus + 17);
}


// Initialisation position

function initialisationSnakePosition(){
    xPosSnake = Math.trunc(Math.random()*numberBlockX) * snakeHeight;
    yPosSnake = Math.trunc(Math.random()*numberBlockY) * snakeHeight;
}

function initialisationApplePosition(){
    xApple = Math.trunc(Math.random()*numberBlockX) * snakeHeight;
    yApple = Math.trunc(Math.random()*numberBlockY) * snakeHeight;
}

function initialisationBonusPosition(){
    xBonus = Math.trunc(Math.random()*numberBlockX) * snakeHeight;
    yBonus = Math.trunc(Math.random()*numberBlockY) * snakeHeight;
}

// Update information 
function scoreUpdated(){
    const scoreContainer = document.querySelector('.score');
    scoreContainer.textContent = `${score}`
}
function numberOfLifeUpdated(){
    const lifeContainer = document.querySelector('.life');
    
    if (life >= 0) {
        lifeContainer.textContent = `${life}`
    }
    else{

        lifeContainer.textContent = "0";
    }
}
function levelUpdate(){
    const levelContainer = document.querySelector('.level');
    levelContainer.textContent = `${level}`;
}

function levelUP(){
    level = Math.floor(score / 300)
}

function updateLife(){
    if(pause){
        collision = false;
        requestAnimationFrame(updateLife);
    }
    if(collision){
        life--;
        collision = false;
        heightBodySnake = 5;
        initialisationApplePosition()
        initialisationSnakePosition()
        numberOfLifeUpdated()
        bodySnake = [bodySnake[bodySnake.length-1]];
        if(life < 0){
            ctx.fillStyle ='#000';
            ctx.font = '80px Arial';
            ctx.fillText('GAME OVER', canvasWidth/5, canvasHeight/3);
            ctx.fillStyle ='#000';
            ctx.font = '30px Arial';
            ctx.fillText("Votre score est de : " + score, canvasWidth/5, canvasHeight/2);
            ctx.fillStyle ='#000';
            ctx.font = '30px Arial';
            ctx.fillText("Appuyer sur ENTRER pour réessayer.", canvasWidth/5, (canvasHeight/3) * 2);
            clearTimeout(intervalID);
        }
    }
}

/* Retry function */

function retry(){
    life = 3;
    score = 0;
    intervalID = setInterval(game,100);
    scoreUpdated();
}

/* function for snake move */

function interaction(event){
    switch(event.keyCode){

        case 37:
            if (codeTouche === 39){
                break
            }
            //gauche
            pause = false;
            moveX = -1;
            moveY = 0;
            codeTouche = event.keyCode;
            break;
        case 38:
            if (codeTouche === 40){
                break
            }
            // haut
            pause = false;
            moveX = 0;
            moveY = -1;
            codeTouche = event.keyCode;
            break;
        case 39:
            if (codeTouche === 37){
                break
            }
            // droite
            pause = false;
            moveX = 1;
            moveY = 0;
            codeTouche = event.keyCode;
            break;
        case 40:
            if (codeTouche === 38){
                break
            }
            // bas
            pause = false;
            moveX = 0;
            moveY = 1;
            codeTouche = event.keyCode;
            break;
        case 32:
            // pause
            pause = true;
            moveX = 0;
            moveY = 0;
            break;
        case 13:
            // retry
            retry();
        default:
    }
}

function game(){
    numberOfLifeUpdated()
    drawSnake();
    drawApple();
    detectionCollision();
    appleEat();
    updateLife();
    bonusPositionManagement()
}