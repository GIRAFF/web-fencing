/* main.js */

// for our Phaser.Game
var game,
	game_state = ["Menu", "Game", "Config", 1],
	text,
	createText, 
	styles = //styles for different text
	 [
		 { font: "72px UnifrakturMaguntia", fill: "#fac" },
		 { font: "100px UnifrakturMaguntia", fill: "#ff3" }
	 ],
	 cursors, // arrows keys
	 player = [], //players  Phaser.game.sprite
	 platforms, //platforms  Phaser.game.sprite
	 gravity = 300; //global player gravity


// script for loading fonts from google fonts.
WebFontConfig = {
	active: function() { console.log("active"); game.time.events.add(Phaser.Timer.SECOND, function(){ console.log("loading correct")}, this); },
	google: {
		families: ["UnifrakturMaguntia"]
	},
	loading: function(){ console.log("loading");}
};

function init()
{
	game = new Phaser.Game(800, 600, Phaser.CANVAS, "game", {
		preload: preload,
		create: create,
		update: update,
		render: render
	});
}

function preload()
{
	// loading font from google fonts too long loading !!!
	game.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
	//load player texture
	game.load.image("playerTexture", "assets/playerTexture.png", 50, 100);
}

function create()
{
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.stage.backgroundColor = "#000";

	//for arrows keys
    cursors = game.input.keyboard.createCursorKeys();
	// for game world size more than screen size
	//game.world.setBounds( -1000, -1000, 1000, 1000);
	game.world.setBounds( 0, 0, 800, 600);

	text = game.add.text(game.world.centerX, game.world.centerY, "this game", styles[1]);
		
	// Player init
	player.push( create_Player(game, {x:0, y:10}, "#fac", "playerTexture", 300, 0.1));
/*	
	player.push( game.add.sprite(0, 10, "playerTexture") );
	game.physics.arcade.enable(player[0]);
	player[0].body.bounce.y = 0.1;
	player[0].body.gravity.y = 300;
	player[0].body.collideWorldBounds = true;
	player[0].body.onGround = {onGround: false};
	player[0].body.maxVelocity = { x: 99999, y: 99999}; 
*/

	//platforms init
	/*platforms = game.add.group();
	platforms.enableBody = true;
	platforms.collideWoldBounds = true;
	platforms.physicsBodyType = Phaser.Physics.ARCADE;
	var p = platforms.create(0, game.world.height - 50, "playerTexture");
	p.scale.setTo(12, 1);
	p.body.immovable = true;*/
}

function update()
{
	// TODO add some update logic
	switch (game_state[3]) {
		case 0:  break;
		case 1:
			if (cursors.up.isDown) {
				if(player[0].body.onGround)
				player[0].body.position.y -= 6;//game.camera.y += 4;
			} else if (cursors.down.isDown) {
				player[0].body.position.y += 6;//game.camera.y -= 4;
			} if (cursors.left.isDown) {
				player[0].body.position.x -= 6;//game.camera.x += 4;
			} else if (cursors.right.isDown) {
				player[0].body.position.x += 6;//game.camera.x -= 4;
			}
		break;
		case 2: break;	
	}
}

function render()
{
	// TODO check what should we do here
	//game.debug.geom(player[0].rect, player[0].color);
	player[0].body.onGround.onGround = game.physics.arcade.collide(player[0], platforms);
	console.log(player[0].body.onGround.onGround);
}
