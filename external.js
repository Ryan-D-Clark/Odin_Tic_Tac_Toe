let board = document.getElementById("board");
let tiles = document.getElementsByClassName("tile");
let dialogContainer = document.getElementById("dialogContainer");
let dialog = document.getElementById("dialog");
dialogContainer.addEventListener("click", () => {
    boardController.clearBoard()
    dialogContainer.close()
});
let closeFormButton = document.getElementById("closeForm");
let playerName = document.getElementById("playerNameInput");
let gameForm = document.getElementById("gameForm");
let footer = document.getElementById("footer");
let radioButtons = document.querySelectorAll('input[name="difficulty"]');
let selectedDifficulty;


closeFormButton.addEventListener("click", () =>{
    event.preventDefault();
    if(playerName.value.length <= 0){
        playerName.value = "Player";
    }

    for(let radio of radioButtons){
        if(radio.checked){
            selectedDifficulty = radio.value;
        }
    }
    gameController.playerName = playerName.value;
    gameController.setPlayerName()
    gameForm.style.display = "none";
    footer.style.display = "none";
})

let computerScoreDisplay = document.getElementById("computerScore");
let playerScoreDisplay = document.getElementById("playerScore");

let boardController = (() =>{
    let board = new Array(9)

    let makeMove = (index, sign) =>{
        tiles[index].innerText = sign;
        board[index] = sign;
    }


    let clearBoard = () =>{
        for(let i = 0; i < tiles.length; i++){
            tiles[i].innerHTML = "";
        }
        for(let i = 0; i < board.length; i++){
            board[i] = "";
        }
    }

    let getEmptyCells = (currentBoard) =>{
        let playableCells = [];
        for(let i = 0; i < currentBoard.length; i++){
            if(currentBoard[i] == gameController.AISign || currentBoard[i] == gameController.playerSign){
            }
            else{
                playableCells.push(i);
            }
        }
        return playableCells;
    }

    for(let i = 0; i < tiles.length; i++){
        tiles[i].addEventListener("click", () =>{
            if(tiles[i].innerText == gameController.AISign || tiles[i].innerText == gameController.playerSign){
                return;
            }
            makeMove(i, gameController.playerSign)
            if(gameController.gameTracker()){
                return;
            }
            if(selectedDifficulty === "impossible" || selectedDifficulty == null){
                makeMove(AIController.takeIntelligentTurn(board, gameController.AISign),gameController.AISign)
            }else if(selectedDifficulty === "hard"){
                makeMove(AIController.takeHardTurn(board, gameController.AISign), gameController.AISign)
            }else if(selectedDifficulty === "normal"){
                makeMove(AIController.takeNormalTurn(board,gameController.AISign), gameController.AISign)
            }
            
            gameController.gameTracker()
        })}
    return{
        board, makeMove, clearBoard, getEmptyCells
    };
})();

let gameController = (() =>{
    let playerName = null
    let playerSign = "X";
    let AISign = "O" ;
    let playerScore = 0;
    let AIScore = 0;


    let checkIfWinnerFound = (currentBoard, currentSign) => {
        if (
            (currentBoard[0] === currentSign && currentBoard[1] === currentSign && currentBoard[2] === currentSign) ||
            (currentBoard[3] === currentSign && currentBoard[4] === currentSign && currentBoard[5] === currentSign) ||
            (currentBoard[6] === currentSign && currentBoard[7] === currentSign && currentBoard[8] === currentSign) ||
            (currentBoard[0] === currentSign && currentBoard[3] === currentSign && currentBoard[6] === currentSign) ||
            (currentBoard[1] === currentSign && currentBoard[4] === currentSign && currentBoard[7] === currentSign) ||
            (currentBoard[2] === currentSign && currentBoard[5] === currentSign && currentBoard[8] === currentSign) ||
            (currentBoard[0] === currentSign && currentBoard[4] === currentSign && currentBoard[8] === currentSign) ||
            (currentBoard[2] === currentSign && currentBoard[4] === currentSign && currentBoard[6] === currentSign)
        ){
            return true;
        }
        else{
            return false;
        }

    }

    let setPlayerName = () =>{
        let playerNameDisplay = document.getElementById("playerName")
        playerNameDisplay.innerHTML = gameController.playerName
    }

    let updateScores = () => {
        computerScore.innerText = AIScore;
        playerScoreDisplay.innerText = playerScore;
    }

    let gameTracker = () => {

        if(checkIfWinnerFound(boardController.board, playerSign)){
            playerScore += 1

            if(playerScore == 3){
                console.log("test 3")
                dialog.innerHTML = `Game Winner <br> ${gameController.playerName}`
                dialogContainer.showModal()
                AIScore = 0
                playerScore = 0
                updateScores()
            }else{
                dialog.innerHTML = `Round Winner <br> ${playerSign}`
                dialogContainer.showModal()
                updateScores()
            }


            return true
        }else if(checkIfWinnerFound(boardController.board, AISign)){
            AIScore += 1
            if(AIScore == 3){
                dialog.innerHTML = `Game Winner <br> Computer`
                dialogContainer.showModal()
                AIScore = 0
                playerScore = 0
                updateScores()
            }
            else{
                dialog.innerHTML = `Round Winner <br> ${AISign}`
                dialogContainer.showModal()
                updateScores()
            }   

            return true
        }

        else if(boardController.getEmptyCells(boardController.board).length == 0){
            dialog.innerHTML = `Round Draw`
            dialogContainer.showModal()
            return true
        }
    }


    return{
        playerSign, playerScore, AISign, AIScore, playerName, setPlayerName, checkIfWinnerFound, updateScores, gameTracker
    };
})();

let AIController = (() =>{

    let minimax = (currentBoard, currentSign) => {

        let availableCells = boardController.getEmptyCells(currentBoard)

        if(gameController.checkIfWinnerFound(currentBoard, gameController.playerSign)){
            return {score: -1};
        }else if(gameController.checkIfWinnerFound(currentBoard,gameController.AISign)){
            return {score: 1};
        } else if(availableCells.length === 0){
            return {score: 0};
        }

        let minimaxOutcomes = [];

        for(let i = 0; i < availableCells.length; i++){
            let currentLoop = {};
            currentLoop.index = availableCells[i];
            currentBoard[availableCells[i]] = currentSign;
            if(currentSign === gameController.AISign){
                let result = minimax(currentBoard, gameController.playerSign)
                currentLoop.score = result.score;
            } else{
                let result = minimax(currentBoard, gameController.AISign)
                currentLoop.score = result.score
            }
            currentBoard[availableCells[i]] = currentLoop.index
            minimaxOutcomes.push(currentLoop)
        }
        let bestLoopScore = null;

        if(currentSign === gameController.AISign){
            let bestScore = -Infinity;
            for(let i = 0; i < minimaxOutcomes.length; i++){
                if(minimaxOutcomes[i].score > bestScore){
                    bestScore = minimaxOutcomes[i].score;
                    bestLoopScore = i
                }
            }
        }
        else{
            let bestScore = Infinity;
            for(let i = 0; i < minimaxOutcomes.length; i++){
                if(minimaxOutcomes[i].score < bestScore){
                    bestScore = minimaxOutcomes[i].score;
                    bestLoopScore = i
                }
            }
        }
        return minimaxOutcomes[bestLoopScore]
        }

        let takeIntelligentTurn = (currentBoard, currentSign) =>{
            let bestPlay = minimax(currentBoard, currentSign)
            return bestPlay.index 
        }

        let takeNormalTurn = (currentBoard, currentSign) =>{
            let intelligentTile = minimax(currentBoard, currentSign)
            let availableCells = boardController.getEmptyCells(currentBoard)
            let randomTile = availableCells[Math.floor(Math.random() * availableCells.length)];
            if(Math.floor(Math.random() * 11) %2){
                return intelligentTile.index
            } 
            else{
                return randomTile
            }
        }

        let takeHardTurn = (currentBoard, currentSign) => {
            let winningCombinations = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6],
              ];
              for(let combination of winningCombinations){
                let counter = 0
                for(let i = 0; i < combination.length; i++){
                    if(boardController.board[combination[i]] == gameController.playerSign){
                        counter += 1
                        if(counter == 2){
                            for(let x = 0; x < combination.length; x++){
                                if(boardController.board[combination[x]] != gameController.playerSign && boardController.board[combination[x]] != gameController.AISign){
                                    return combination[x]
                                }
                            }
                        }
                    }
                }
              }
            
            let intelligentTile = minimax(currentBoard, currentSign)
            let availableCells = boardController.getEmptyCells(currentBoard)
            let randomTile = availableCells[Math.floor(Math.random() * availableCells.length)];
            if(Math.floor(Math.random() * 11) %2){
                return intelligentTile.index
            } 
            else{
                return randomTile
            }
        }

    return{
        minimax, takeIntelligentTurn, takeNormalTurn, takeHardTurn
    };


})();


