// Create game interface
var gameUI = new GameUI(".container", player);
console.log(player)

// Initialize game
// TODO: Reimplement this function to support multiplayer
var init = function() {
	debugger
	$.getJSON("/board", function(data){
		gameUI.setBoard(data)
		console.log(data)
	})

	if(gameUI.checkEnded()){
		gameUI.setMessage("The game has ended.");
		return;
	}

	$.getJSON("/turn", function(data){
		console.log(data)
		debugger

		if (gameUI.player == data){
			gameUI.setMessage("It is your move.");
			gameUI.waitForMove();
		}

		if(gameUI.player != data){
			gameUI.setMessage("Waiting for opponent…");
			gameUI.disable();
			waitForOpponent();
		}
	})
}

function waitForOpponent() {
	var timer = setInterval(() => {
		$.getJSON("/turn", function(data) {
			if(data == ""){
				gameUI.setMessage("The Game Has Ended.")

				clearInterval(timer)
				return;
			}

			if(data == gameUI.player){
				//TODO: set board

				gameUI.setMessage("It is your move.")

				gameui.waitForMove()
				clearInterval(timer)
				return;
			}

			if(data != gameUI.player){
				gameUI.setMessage("Waiting for opponent...")
			}
		})
	}, 1000);
}


// Callback function for when the user makes a move
// TODO: Reimplement this function to support multiplayer
var callback = function(row, col, player) {
	debugger
	gameUI.setMessage("Sending your move…")
	$.getJSON("/move", { row: row, col: col, player: player}, function(data){
		console.log(data);
		if(data == true){
			gameUI.disable();
			gameUI.setSquare(row,col,player);
			gameUI.setMessage("Waiting For Opponent");
			waitForOpponent();
		}
		if(data == ""){
			gameUI.setMessage("The Game Has Ended");
		}
	})
};

// Set callback for user move
gameUI.callback = callback;

// Initialize game
init()
