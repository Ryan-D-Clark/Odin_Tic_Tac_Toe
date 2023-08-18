// Factory

const personFactory = (name, age) => {
    const sayHello = () => console.log('hello!');
    return { name, age, sayHello };
};
  
const jeff = personFactory('jeff', 27);

console.log(jeff.name); // 'jeff'

jeff.sayHello(); // calls the function and logs 'hello!'

let tiles = document.getElementsByClassName("tile")
let playerSymbol = "x"
let computerSymbol = "o"
let winningCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

let AIController = (() => {
    let playableTiles = new Array(9)
    let playableList


    let checkPlayableTiles = () => {
        playableList = []
        for(let pos = 0; pos < gameController.board.length; pos++){
            if(gameController.board[pos] == "x" || gameController.board[pos] == "o"){
                playableTiles[pos] = "NA"
            }
            else{
                playableList.push(pos)
            }
        }
        if(playableList.length == 0){
            console.log("No available spots")
        }
        else{
            makeMove()
        }
    }
    
    let makeMove = () => {
        console.log("AI playable spots:", playableList)
        let randomPos = playableList[Math.floor(Math.random() * playableList.length)]
        console.log("Picked index:", randomPos)
        gameController.board[randomPos] = computerSymbol
        tiles[randomPos].innerHTML = computerSymbol
        gameController.checkRound(computerSymbol)
    }
    return{
        checkPlayableTiles,
        makeMove
    }


})();

let gameController = (() => {
    let board = new Array(9);
    let computerScore = 0;
    let playerScore = 0;
    let currentlyPlaying = true
    let logBoard = () => console.log(board);

    let checkRound = (symbol) => {
        console.log("Testing", board.length)
        for(combination in winningCombinations){
            let counter = 0
            for(pos in winningCombinations[combination]){
                if(gameController.board[winningCombinations[combination][pos]] == symbol){
                    counter += 1
                }else{
                    break
                }}
            if(counter == 3){
                displayController.showRoundWinner(symbol)
                currentlyPlaying = false
                roundFinisher(symbol)
            }}}
            
    for(let i = 0; i < tiles.length; i++){
        tiles[i].addEventListener("click", function(){
            if(gameController.board[i] == playerSymbol || gameController.board[i] == computerSymbol){
                console.log("Already picked")
                displayController.showPlayerError()}
            else{
                gameController.board[i] = playerSymbol
                tiles[i].innerHTML = playerSymbol
                console.log(gameController.board)
                checkRound(playerSymbol)
                if(currentlyPlaying){
                    AIController.checkPlayableTiles()
                }
                else{
                    currentlyPlaying = true
                }
            }})}

    let roundFinisher = (symbol) => {
        if(symbol == playerSymbol){
            playerScore += 1
        }
        else{
            computerScore +=1
        }
        gameController.board = new Array(9)
        for(let i = 0; i < tiles.length; i++){
            tiles[i].innerHTML = ""
        }
        console.log(`${symbol} won that round!`)
        console.log("Player Score:", playerScore, "Computer Score:", computerScore)
    }
    return {
        board,
        logBoard,
        checkRound,
        roundFinisher,
        currentlyPlaying,
        computerScore,
        playerScore
    }})();

let displayController = (() => {
    let alertContainer = document.getElementById("alert-container")
    let playerError = document.getElementById("player-error")
    let roundWinner = document.getElementById("round-winner")
    let gameWinner = document.getElementById("game-winner")
    let roundDraw = document.getElementById("round-draw")


    alertContainer.addEventListener("click", function(){
        alertContainer.style.display = "none"
        playerError.style.display = "none"
        roundWinner.style.display = "none"
        gameWinner.style.display = "none"

    })

    let showPlayerError = () => {
        alertContainer.style.display = "block"
        playerError.style.display = "block"
    }

    let showRoundWinner = (symbol) => {
        alertContainer.style.display = "block"
        roundWinner.innerHTML = `Round winner<br>${symbol}<br><br>Click to continue...`
        roundWinner.style.display = "block"
    }

    let showRoundDraw = () => {
        alertContainer.style.display = "block"
        roundDraw.style.display = "block"
    }

    let showGameWinner = () => {
        alertContainer.style.display = "block"
        gameWinner.style.display = "block"

    }
    return {
        alertContainer,
        playerError,
        showPlayerError,
        showRoundWinner,
        showGameWinner,
        showRoundDraw
    }})();

