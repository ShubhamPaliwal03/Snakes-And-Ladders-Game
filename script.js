// code for working of dice

let dice = document.getElementById('dice')

dice.addEventListener('click', rollDice)

// Uncomment the following lines if you want to transform the dice button into a restart game button :-

// let diceButtonPurpose = 'rollDice'
// dice.addEventListener('click', () => diceButtonPurpose == 'rollDice' ? rollDice() : window.location.reload())

function generateRandom(min, max)
{
    return Math.ceil(Math.random() * (max - min) + min)
}

let dice_img = document.getElementById('dice_img')

let degree = 180

let dice_value = 1

// creating HTMLAudioObjects using Audio() constructor

// const diceRollSound = new Audio('sounds/dice_roll-sound.mp3')

const ladderClimbSound = new Audio('sounds/ladder_climb-sound.mp3')

const snakeBiteSound = new Audio('sounds/snake_bite-sound.mp3')

const victorySound = new Audio('sounds/victory-sound.mp3')

const jumpSound = new Audio('sounds/piece_move-sound.mp3')

const confettiButton = document.getElementsByClassName('confetti-button')[0]

const message = document.getElementById('message')

const loading_animation = document.createElement('img')

loading_animation.src = "images/loading_animation.gif"

loading_animation.id = "loading-animation"

const query1 = window.matchMedia("(max-width: 1200px) and (orientation: landscape)")

const setAccToMediaQuery1 = (query, called_from) => {

    if(called_from == "rollDice"){

        if(query.matches){
            message.style.paddingTop = "140px";
        }
        else{
            message.style.paddingTop = "70px";
        }
    }
    else if(called_from == "toggleMessage"){
        
        if(query.matches){
            message.style.paddingTop = "10px";
        }
        else{
            message.style.paddingTop = "0px";
        }
    }
}

function rollDice()
{
    dice.disabled = true

    message.appendChild(loading_animation)

    setAccToMediaQuery1(query1, "rollDice")

    // creating a new object of the HTMLAudioObject everytime rollDice function is called,
    // so that even if the sound was already playing, it is played from the start

    new Audio('sounds/dice_roll-sound.mp3').play()

    dice_value = generateRandom(0, 6)

    dice_img.src = "images/dice_"+dice_value+".png"

    dice.style.transform = "rotateX("+degree+"deg) rotateY("+degree+"deg)"

    degree += 180

    setTimeout(performAction, 1000)
}

// for testing purposes

// setInterval(() => {

//     if(dice.disabled == false){

//         rollDice();
//     }

// }, 2000)

let red_player_pos = 1

let blue_player_pos = 1

// code to maintain chance of every player

let i = 1

// get the object reference of the red player icon

const red_player_icon = document.getElementById('red_player_icon')

// get the object reference of the blue player icon

const blue_player_icon = document.getElementById('blue_player_icon')

function toggleMessage()
{
    setAccToMediaQuery1(query1, "toggleMessage")

    if(i % 2 == 1)
    {
        message.innerText = "Blue Player's Turn"
        
        message.style.color = "blue"
    }
    else
    {
        message.innerText = "Red Player's Turn"
        
        message.style.color = "red"
    }
}

async function performAction()
{
    if(i % 2 == 1) // red player's turn
    {
        const target_pos = red_player_pos + dice_value

        if(target_pos <= 100)
        {
            for(let pos = red_player_pos; pos < target_pos; pos++)
            {
                // create a promise that resolves after 500ms,
                // so that the execution of the loop is paused until every 'setTimeout' delay is completed
                // this is done to ensure there is no dom manipulation errors, which would have been
                // produced due to the asyncronous nature of JavaScript

                await new Promise(resolve => setTimeout(resolve, 500)) // wait for 500ms (0.5s)

                removeFromAndMovePlayerTo(pos, pos+1)

                // red_player_pos = pos
                
                jumpSound.play()
            }

            // check if the player has reached the 100 position with the exact number of dice value

            if(target_pos == 100)
            {
                // change the message, and its color
        
                message.innerText = "Red Player Won!"

                message.style.color = "red"
        
                playerWon()
            }
        }
        else
        {
            toggleMessage()
        }

        if(target_pos < 100)
        {
            // check for any snake or ladder at the target index

            await ActionIfSnakeOrLadder(target_pos)

            if(red_player_pos !== 100)
            {
                // change the turn message, and its color
                
                toggleMessage()
            }
        }
    }
    else // blue player's turn
    {   
        const target_pos = blue_player_pos + dice_value

        if(target_pos <= 100)
        {
            for(let pos = blue_player_pos; pos < target_pos; pos++)
            {
                // create a promise that resolves after 500ms,
                // so that the execution of the loop is paused until every 'setTimeout' delay is completed
                // this is done to ensure there is no dom manipulation errors, which would have been
                // produced due to the asyncronous nature of JavaScript

                await new Promise(resolve => setTimeout(resolve, 500)) // wait for 500ms (0.5s)
                
                removeFromAndMovePlayerTo(pos, pos+1)

                // blue_player_pos = pos
                
                jumpSound.play()
            }

            // check if the player has reached the 100 position with the exact number of dice value

            if(target_pos == 100)
            {
                // change the message, and its color
        
                message.innerText = "Blue Player Won!"

                message.style.color = "blue"
        
                playerWon()
            }
        }
        else
        {
            toggleMessage()
        }

        if(target_pos < 100)
        {
            // check for any snake or ladder at the target index
    
            await ActionIfSnakeOrLadder(target_pos)
            
            if(blue_player_pos !== 100)
            {
                // change the turn message, and its color
                
                toggleMessage()
            }
        }    
    }

    if(blue_player_pos != 100 && red_player_pos != 100)
    {
        dice.disabled = false
    }
    
    i++
}

// code to achieve the functionality of snakes and ladders

// creating a map to store the starting and ending points of the ladders as key-value pairs.

const ladders_map = new Map([[1, 38], [4, 14], [9, 31], [21, 42], [28, 84], [51, 67], [71,91], [80, 100]])

// creating a map to store the starting and ending points of the snakes as key-value pairs.

const snakes_map = new Map([[17, 7], [62, 19], [54, 34], [64, 60], [87, 24], [93, 73], [95, 75], [98, 79]])

async function ActionIfSnakeOrLadder(cell_number)
{
    console.log(cell_number)

    if(ladders_map.has(cell_number)) // check if the cell has a ladder on it
    {
        const new_cell_number = Number(ladders_map.get(cell_number))
        
        console.log("You just stepped on a ladder! Jumping to cell "+new_cell_number)

        ladderClimbSound.play()

        console.log("red player pos ",red_player_pos,"blue player pos ", blue_player_pos)

        await climbUpOrSlideDown("ladder", cell_number, new_cell_number)

        console.log("new red player pos ",red_player_pos,"new blue player pos ", blue_player_pos)

        if(red_player_pos == 100)
        {
            // change the turn message, and its color
    
            message.innerText = "Red Player Won!"

            message.style.color = "red"
    
            playerWon()
        }
        else if(blue_player_pos == 100)
        {
            // change the turn message, and its color
    
            message.innerText = "Blue Player Won!"

            message.style.color = "blue"
    
            playerWon()
        }
    }
    else if(snakes_map.has(cell_number)) // check if the cell has a snake on it
    {
        const new_cell_number = Number(snakes_map.get(cell_number))

        console.log("You just stepped on a snake! Jumping to cell "+new_cell_number)

        snakeBiteSound.play()

        await climbUpOrSlideDown("snake", cell_number, new_cell_number)
    }
}

const snakesPathMap = new Map([

    [17, [16, 6, 7]],
    [54, [48, 34]],
    [62, [58, 42, 43, 37, 24, 18, 19]],
    [64, [63, 62, 59, 60]],
    [87, [74, 67, 55, 46, 45, 36, 25, 24]],
    [93, [88, 89, 73]],
    [95, [87, 86, 75]],
    [98, [83, 79]]
])

const laddersPathMap = new Map ([

    [1, [19, 23, 38]],
    [4, [5, 15, 14]],
    [9, [11, 30, 31]],
    [21, [39, 42]],
    [28, [33, 47, 55, 66, 76, 84]],
    [51, [52, 68, 67]],
    [71, [90, 91]],
    [80, [81, 100]]
])

async function climbUpOrSlideDown(snake_or_ladder, current_cell_number, target_cell_number)
{
    if (snake_or_ladder == 'ladder') {

        // if the player stepped on a ladder, then climb up the ladder

        console.log("Climbing up the snake from cell "+current_cell_number+" to cell "+target_cell_number)

        // get the path of the ladder
        
        const path = laddersPathMap.get(current_cell_number)

        console.log("Path of the ladder: ", path)

        // remove the player icon from the current cell and move it to the first cell of the path

        removeFromAndMovePlayerTo(current_cell_number, path[0])

        // iterate through the path and move the player icon

        for(let pos = 0; pos < path.length - 1; pos++)
        {
            // create a promise that resolves after 500ms,
            // so that the execution of the loop is paused until every 'setTimeout' delay is completed
            // this is done to ensure there is no dom manipulation errors, which would have been
            // produced due to the asyncronous nature of JavaScript

            await new Promise(resolve => setTimeout(resolve, 500)) // wait for 500ms (0.5s)
        
            removeFromAndMovePlayerTo(path[pos], path[pos+1])

            jumpSound.play()
        }
    }
    else if (snake_or_ladder == 'snake') {

        // if the player stepped on a snake, then slide down the snake

        console.log("Sliding down the snake from cell "+current_cell_number+" to cell "+target_cell_number)

        // get the path of the snake
        
        const path = snakesPathMap.get(current_cell_number)

        console.log("Path of the snake: ", path)

        // remove the player icon from the current cell and move it to the first cell of the path

        removeFromAndMovePlayerTo(current_cell_number, path[0])

        // iterate through the path and move the player icon

        for(let pos = 0; pos < path.length - 1; pos++)
        {
            // create a promise that resolves after 500ms,
            // so that the execution of the loop is paused until every 'setTimeout' delay is completed
            // this is done to ensure there is no dom manipulation errors, which would have been
            // produced due to the asyncronous nature of JavaScript

            await new Promise(resolve => setTimeout(resolve, 500)) // wait for 500ms (0.5s)
        
            removeFromAndMovePlayerTo(path[pos], path[pos+1])

            jumpSound.play()
        }
    }
}

function removeFromAndMovePlayerTo(current_cell_number, target_cell_number)
{
    let player_icon // to store the reference of the player icon

    if(i % 2 == 1) // if it was red player's turn
    {
        console.log("Removing Red Player's Token from cell "+current_cell_number)

        player_icon = document.getElementById('red_player_icon')

        red_player_pos = target_cell_number
    }
    else // if it was blue player's turn
    {
        console.log("Removing Blue Player's Token from cell "+current_cell_number)

        player_icon = document.getElementById('blue_player_icon')

        blue_player_pos = target_cell_number
    }

    // get the reference of the current cell

    let current_cell = document.getElementById('_'+current_cell_number)

    console.log(" and moving it to cell "+target_cell_number)

    // remove the respective icon from the current cell

    current_cell.removeChild(player_icon)

    // get the reference of the new cell

    const target_cell = document.getElementById("_"+target_cell_number)

    // add the respective player icon to the target cell

    target_cell.appendChild(player_icon)
}

function playerWon()
{
    message.style.paddingTop = "0px"

    confettiButton.click()

    victorySound.play()

    dice.disabled = true

    // Uncomment the following lines if you want to transform the dice button into a restart game button :-

    // transform the dice button into the restart game button
    
    // diceButtonPurpose = 'restartGame'
    
    // dice.innerHTML = '<i class="fa-solid fa-arrow-rotate-right"></i>'
    
    // dice.disabled = false

    return
}