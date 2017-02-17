/* main.js */

// for our Phaser.Game
var game,
	game_state = ["Menu", "Game", "Config", 1],
	text, 
	styles = //styles for different text
	 [
		 { font: "72px UnifrakturMaguntia", fill: "#fac" },
		 { font: "100px UnifrakturMaguntia", fill: "#ff3" }
	 ],
	 cursors; // arrows keys

// script for loading fonts from google fonts.
WebFontConfig = {
	active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },
	google: {
		families: ["UnifrakturMaguntia"]
	}
};

function init()
{
	game = new Phaser.Game(800, 600, Phaser.AUTO, "game", {
		preload: preload,
		create: create,
		update: update,
		render: render
	});
}

function preload()
{
	// loading font from google fonts
	game.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
}

function create()
{
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.stage.backgroundColor = "#000000";

	//for arrows keys
    cursors = game.input.keyboard.createCursorKeys();
	// for game world size more than screen size
	game.world.setBounds( -1000, -1000, 1000, 1000);
	text = game.add.text(game.world.centerX, game.world.centerY, "nidhogg", styles[1]);
	/*titles.push( game.add.text(game.world.centerX, game.world.centerY, "Menu", style) );
	titles.push( game.add.text(game.world.centerX, game.world.centerY, "Game", style) );
	titles.push( game.add.text(game.world.centerX, game.world.centerY, "Config", style) );*/
}

function update()
{
	// TODO add some update logic
	switch (game_state[3]) {
		case 0: break;
		case 1:
			if (cursors.up.isDown) {
				game.camera.y += 4;
			} else if (cursors.down.isDown) {
				game.camera.y -= 4;
			} if (cursors.left.isDown) {
				game.camera.x += 4;
			} else if (cursors.right.isDown) {
				game.camera.x -= 4;
			}
		break;
		case 2: break;	
	}
}

function render()
{
	// TODO check what should we do here
}
