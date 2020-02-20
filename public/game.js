// Create game interface
var gameUI = new GameUI(".container", player);
console.log(player)

function setBoard(){
	$.getJSON("/board", function(data){
		gameUI.setBoard(data)
	})
}


// Initialize game
// TODO: Reimplement this function to support multiplayer
var init = function() {
	setBoard()

	if(gameUI.checkEnded()){
		gameUI.setMessage("The game has ended.");
		return;
	}

	$.getJSON("/turn", function(data){
		console.log(data)

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
			if(data != gameUI.player && data != ""){
				gameUI.setMessage("Waiting for opponent...")
				return
			}

			setBoard()

			if(data == ""){
				gameUI.setMessage("The Game Has Ended.")

				clearInterval(timer)
				return;
			}

			if(data == gameUI.player){
				clearInterval(timer)

				gameUI.setMessage("It is your move.")
				gameUI.waitForMove()
				return;
			}
		})
	}, 1000);
}


// Callback function for when the user makes a move
// TODO: Reimplement this function to support multiplayer
var callback = function(row, col, player) {
	gameUI.setMessage("Sending your move…")
	$.getJSON("/move", { row: row, col: col, player: player}, function(data){
		console.log(data);
		if(data == true){
			gameUI.disable();
			gameUI.setSquare(row,col,player);
			gameUI.setMessage("Waiting For Opponent");
			waitForOpponent();
			return
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
