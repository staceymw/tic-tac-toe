function createBoard() {
  let board = Array(9).fill(null);

  const getBoard = () => {
    return board;
  };

  const resetBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = null;
    }
  };

  return {
    board,
    getBoard,
    resetBoard,
  };
}

const createPlayer = (name, marker) => {
  const getName = () => {
    return name;
  };

  const getMarker = () => {
    return marker;
  };

  return {
    name,
    marker,
    getName,
    getMarker,
  };
};

const game = (() => {
  const gameBoard = createBoard();
  const player1 = createPlayer("Player1", "X");
  const player2 = createPlayer("Player2", "O");
  let currentPlayer = player1;

  const renderBoard = (board) => {
    const container = document.getElementById("gameboard-container");
    container.innerHTML = "";

    for (let i = 0; i < board.length; i++) {
      const square = document.createElement("div");
      square.classList.add("square");
      square.setAttribute("data-index", i);
      square.textContent = board[i] ? board[i] : "";
      container.appendChild(square);
    }
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    updateTurn();
  };

  const updateTurn = () => {
    const turn = document.getElementById("turn");
    turn.textContent = `${currentPlayer.getMarker()}'s Turn`;
  };

  const isAvailable = (index) => {
    return gameBoard.board[index] === null;
  };

  const checkForWinner = () => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    const isTie =
      gameBoard.board.filter((square) => square === null).length === 0;
    let result = false;
    //iterative approach versus declarative approach
    for (let i = 0; i < winningCombos.length; i++) {
      const [a, b, c] = winningCombos[i];
      const isWin =
        gameBoard.board[a] &&
        gameBoard.board[a] === gameBoard.board[b] &&
        gameBoard.board[a] === gameBoard.board[c];

      if (isWin) {
        result = true;
        return result;
      }
    }

    if (isTie) {
      return "Tie";
    } else {
      return null;
    }
  };

  const makeMove = (index, player) => {
    if (isAvailable(index)) {
      const marker = player.getMarker();
      gameBoard.board[index] = marker;
      renderBoard(gameBoard.getBoard());
      return true;
    } else {
      return false;
    }
  };

  const handleMove = (e) => {
    const index = e.target.getAttribute("data-index");
    if (!isAvailable(index)) {
      console.log("square not available");
      return;
    }

    makeMove(index, currentPlayer);

    if (isGameOver()) {
      handleGameOver();
    } else {
      switchPlayer();
    }
  };

  const isGameOver = () => {
    let winner = checkForWinner();
    if (winner) {
      return true;
    } else if (gameBoard.board.includes(null)) {
      return false;
    } else {
      console.log(tie);
      return true;
    }
  };

  const handleGameOver = () => {
    const winner = checkForWinner();
    const winnerAlert = document.getElementById("turn");
    const container = document.getElementById("gameboard-container");

    container.removeEventListener("click", handleMove);
    if (winner === "Tie") {
      winnerAlert.textContent = "Tie Game!";
    } else {
      winnerAlert.textContent = `${currentPlayer.getMarker()} Wins!`;
    }
  };

  const start = () => {
    renderBoard(gameBoard.getBoard());
    updateTurn();

    const container = document.getElementById("gameboard-container");
    container.addEventListener("click", handleMove);
  };

  const resetGame = () => {
    gameBoard.resetBoard();
    currentPlayer = player1;

    const winnerAlert = document.getElementById("turn");
    winnerAlert.textContent = "";
    const container = document.getElementById("gameboard-container");

    container.textContent = `${currentPlayer.getName()}'s Turn`;
    container.removeEventListener("click", handleMove);
    container.addEventListener("click", handleMove);

    start();
  };

  const resetButton = document.createElement("button");
  const body = document.getElementsByTagName("body")[0];
  resetButton.setAttribute("id", "reset-button");
  resetButton.textContent = "RESET";
  body.appendChild(resetButton);
  resetButton.addEventListener("click", resetGame);

  return {
    start,
  };
})();

game.start();
