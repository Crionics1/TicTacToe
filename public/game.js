// Create game interface
var gameUI = new GameUI(".container", player);
console.log(player)

var socket = io.connect("localhost:4000")

socket.on('move',function(data){
	if (data != gameUI.player && data != "") {
		gameUI.setMessage("Waiting for opponent...")
		return
	}

	//else set new board
	setBoard()

	//check if it's the players turn
	if (data == gameUI.player) {
		gameUI.setMessage("It is your move.")
		gameUI.waitForMove()
		return;
	}
})

//Get Board from server and set it 
async function setBoard() {
	$.getJSON("/board", function (data) {
		gameUI.setBoard(data)
		if (gameUI.checkEnded()) {
			gameUI.setMessage("The game has ended.");
		}
	})
}

//wait for opponent using long polling
/* function waitForOpponent() {
	var timer = setInterval(() => {
		$.getJSON("/turn", function (data) {
			// if it's still opponent's turn continue long polling
			if (data != gameUI.player && data != "") {
				gameUI.setMessage("Waiting for opponent...")
				return
			}

			//else set new board
			setBoard()

			//check if it's the players turn
			if (data == gameUI.player) {
				gameUI.setMessage("It is your move.")
				gameUI.waitForMove()
				return;
			}

			//stop long polling if no longer opponents turn
			clearInterval(timer)
		})
	}, 1000);
} */


// Initialize game
// TODO: Reimplement this function to support multiplayer
var init = function () {
	setBoard()
		.then(() => {
			$.getJSON("/turn", function (data) {
				//if its users turn wait for turn
				if (gameUI.player == data) {
					gameUI.setMessage("It is your move.");
					gameUI.waitForMove();
				}

				//if its opponents turn disable user's UI and wait for his move
				if (gameUI.player != data && data != "") {
					gameUI.setMessage("Waiting for opponent…");
					gameUI.disable();
					//waitForOpponent();
				}
			})
		})
}

// Callback function for when the user makes a move
// TODO: Reimplement this function to support multiplayer
var callback = function (row, col, player) {
	gameUI.setMessage("Sending your move…")
	$.post("/move", { row: row, col: col, player: player }, function (data) {
		if (data == "true") {
			gameUI.disable();
			gameUI.setSquare(row, col, player);
			gameUI.setMessage("Waiting For Opponent");
			//waitForOpponent();
			return
		}
		if (data == "") {
			gameUI.setMessage("The Game Has Ended");
		}
	})
};


// Set callback for user move
gameUI.callback = callback;

// Initialize game
init()
