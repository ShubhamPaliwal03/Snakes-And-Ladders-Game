// code for working of dice

let dice = document.getElementById('dice')

dice.addEventListener('click', rollDice)

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

    if(called_from === "rollDice"){

        if(query.matches){
            message.style.paddingTop = "140px";
        }
        else{
            message.style.paddingTop = "70px";
        }
    }
    else if(called_from === "toggleMessage"){
        
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

function performAction()
{
    if(i % 2 === 1) // red player's turn
    {
        let target_cell = red_player_pos + dice_value;

        // check if the player has reached the 100 position with the exact number of dice value
        
        if(target_cell <= 100)
        {
            if(target_cell == 100)
            {
                // change the message, and its color
        
                message.innerText = "Red Player Won!"

                message.style.color = "red"
        
                playerWon()
            }
            else
            {
                // change the message, and its color
        
                toggleMessage()
            }

            const new_cell = removeFromAndMovePlayerTo(red_player_pos, target_cell)
    
            jumpSound.play()

            if(target_cell !== 100)
            {
                ActionIfSnakeOrLadder()
            }
        }
        else
        {
            toggleMessage()
        }
    }
    else // blue player's turn
    {   
        let target_cell = blue_player_pos + dice_value;

        // check if the player has reached the 100 position with the exact number of dice value
        
        if(target_cell <= 100)
        {
            if(target_cell === 100)
            {
                // change the message, and its color
        
                message.innerText = "Blue Player Won!"

                message.style.color = "blue"
        
                playerWon()
            }
            else
            {
                // change the turn message, and its color
        
                toggleMessage()
            }
            
            const new_cell = removeFromAndMovePlayerTo(blue_player_pos, target_cell)
    
            jumpSound.play()

            if(target_cell !== 100)
            {
                ActionIfSnakeOrLadder(target_cell)
            }
        }
        else
        {
            toggleMessage()
        }
    }
    
    i++

    if(blue_player_pos != 100 && red_player_pos != 100)
    {
        dice.disabled = false
    }
}

// code to achieve the functionality of snakes and ladders

// creating a map to store the starting and ending points of the ladders as key-value pairs.

const ladders_map = new Map([[1, 38], [4, 14], [9, 31], [21, 42], [28, 84], [51, 67], [71,91], [80, 100]])

// creating a map to store the starting and ending points of the snakes as key-value pairs.

const snakes_map = new Map([[17, 7], [62, 19], [54, 34], [64, 60], [87, 24], [93, 73], [95, 75], [98, 79]])

function ActionIfSnakeOrLadder(cell_number)
{
    console.log(cell_number)

    if(ladders_map.has(cell_number)) // check if the cell has a ladder on it
    {
        const new_cell_number = Number(ladders_map.get(cell_number))
        
        console.log("You just stepped on a ladder! Jumping to cell "+new_cell_number)

        ladderClimbSound.play()

        removeFromAndMovePlayerTo(cell_number, new_cell_number)

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

        removeFromAndMovePlayerTo(cell_number, new_cell_number)
    }
}

function removeFromAndMovePlayerTo(prev_cell_number, new_cell_number)
{
    let player_icon // to store the reference of the player icon

    if(i % 2 == 1) // if it was red player's turn
    {
        player_icon = document.getElementById('red_player_icon')

        red_player_pos = new_cell_number
    }
    else // if it was blue player's turn
    {
        player_icon = document.getElementById('blue_player_icon')

        blue_player_pos = new_cell_number
    }

    // get the reference of the current cell

    const prev_cell = document.getElementById('_'+prev_cell_number)

    // remove the respective icon from the current cell

    prev_cell.removeChild(player_icon)

    // get the reference of the new cell

    const new_cell = document.getElementById("_"+new_cell_number)

    // add the respective player icon to the new cell

    new_cell.appendChild(player_icon)

    return new_cell
}

function playerWon()
{
    message.style.paddingTop = "0px";

    confettiButton.click()

    victorySound.play()

    dice.disabled = true
}