const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')
canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 630,
        y: 128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    frameMax: 6
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset:{
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    scale: 2.5,
    framesMax: 8,
    offset: {
        x: 180, 
        y: 155
    },
    sprites: {
        idle:{
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run:{
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8,
        },
        jump:{
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2,
        },
        fall:{
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2,
        },
        attack1:{
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6,
        },
        takeHit:{
            imageSrc: "./img/samuraiMack/Take Hit.png",
            framesMax: 4,
        },
        death:{
            imageSrc: "./img/samuraiMack/Death.png",
            framesMax: 6,
        }
    },
    attackBox:{
        offset:{
            x: 100,
            y:50
        },
        width: 190,
        height:50
    }
})


const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y:0
    },
    color : 'blue',
    offset:{
        x: -50,
        y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    scale: 2.5,
    framesMax: 4,
    offset: {
        x: 215, 
        y: 167
    },
    sprites: {
        idle:{
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4
        },
        run:{
            imageSrc: './img/kenji/Run.png',
            framesMax: 8,
        },
        jump:{
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2,
        },
        fall:{
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2,
        },
        attack1:{
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4,
        },
        takeHit:{
            imageSrc: "./img/kenji/Take hit.png",
            framesMax: 3,
        },
        death:{
            imageSrc: "./img/kenji/Death.png",
            framesMax: 7,
        }
    },
    attackBox:{
        offset:{
            x: -175,
            y:50
        },
        width: 175,
        height:50
    }
})

console.log(player)

const keys = {
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    w:{
        pressed: false
    },
    ArrowRight:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    },
    ArrowUp:{
        pressed: false
    }
}


 
decreaseTimer()

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    shop.update()
    player.update()
    enemy.update() 
    
    player.velocity.x = 0
    enemy.velocity.x = 0

    
    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5
        player.switchSprite('run')
    }else if(keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
        player.switchSprite('run')
    }else{
        player.switchSprite('idle')
    }

    if(player.velocity.y < 0){
       player.switchSprite('jump') 
    }else if(player.velocity.y > 0){
        player.switchSprite('fall')
    }


    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5
       enemy.switchSprite('run')
    }else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    }else{
        enemy.switchSprite('idle')
    }

    if(enemy.velocity.y < 0){
        enemy.switchSprite('jump') 
     }else if(enemy.velocity.y > 0){
        enemy.switchSprite('fall')
     }

    if(rectangularCollision({rectangle1: player, rectangle2: enemy})
        && player.isAttacking && player.frameCurrent == 4){
        enemy.takeHit()
        player.isAttacking = false

        gsap.to('#enemyHealth',{
            width: enemy.health+'%'
        })
    }

    if(player.isAttacking && player.frameCurrent === 4){
        player.isAttacking = false
    }

    if(rectangularCollision({rectangle1: enemy, rectangle2: player})
        && enemy.isAttacking && enemy.frameCurrent === 2){
        player.takeHit()
        enemy.isAttacking = false
        gsap.to('#playerHealth',{
            width: player.health+'%'
        })
    }

    if(enemy.isAttacking && enemy.frameCurrent === 2){
        enemy.isAttacking = false
    }

    if(enemy.health<=0 || player.health<=0){
        determineWinner({player, enemy, timerId})
    }

    
}

animate()

window.addEventListener('keydown', (event)=>{
    if(!player.death){
        switch(event.key){
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                
                break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
            
                break
            case 'w':
                if(!player.isJumping){
                    player.jump()
                }
                break
            case ' ':
                player.attack()
                break 
                      
        }
        
    }

    if(!enemy.death){
        switch(event.key){
            case 'ArrowRight':
                    keys.ArrowRight.pressed = true
                    enemy.lastKey = 'ArrowRight'
                    break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                if(!enemy.isJumping){
                    enemy.jump()
                }            
                break 
            case 'ArrowDown':
                enemy.attack()
                break      
        }
    }
    

})

window.addEventListener('keyup', (event)=>{
    switch(event.key){
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break

        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break   
        case 'ArrowDown':
            keys.ArrowRight.pressed = false
            break      
    }
    
})