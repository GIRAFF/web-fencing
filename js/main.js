/* main.js */

// for our Phaser.Game
var game,
	game_state = {
		MENU: 0,
		CONFIG: 1,
		PAUSE: 2,
		GAME: 3
	},
	curr_state = game_state.GAME,
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
	active: function()
	{
		console.log("active");
		game.time.events.add(Phaser.Timer.SECOND, function()
			{
				console.log("loading correct");
			}, this);
	},
	google: {
		families: ["UnifrakturMaguntia"]
	},
	loading: function(){ console.log("loading"); }
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
	game.load.spritesheet("playerHeadSpriteSheet", "assets/headSpriteSheet.png", 26, 48, 4, 0, 0);//head
	game.load.spritesheet("playerBodySpriteSheet", "assets/bodySpriteSheet0.png", 27, 116, 4, 0, 0);//body
	game.load.spritesheet("playerLegLeftSpriteSheet", "assets/leftLegSpriteSheet.png", 19, 43, 2, 0, 0);//legs right
	game.load.spritesheet("playerLegRightSpriteSheet", "assets/rightLegSpriteSheet.png", 14, 45, 2, 0, 0);//legs right
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
	player.push( createPlayer(game, {x:100, y:10}, "#fac", ["playerHeadSpriteSheet",
														  "playerBodySpriteSheet",
														  "playerHandLeftSpriteSheet",
														  "playerHandRightSpriteSheet",
														  "playerLegLeftSpriteSheet",
														  "playerLegRightSpriteSheet"], 300, 0.1));
}

function update()
{
	//Save dirrection player for scale
	var temp_dir = player[0].dirrection;

	switch (curr_state) {
	case game_state.GAME:
		//animation stay
		if (cursors.up.isDown ||
			cursors.down.isDown ||
			cursors.left.isDown ||
			cursors.right.isDown) {
			player[0].setAnimation("stay");
		}

		if (cursors.up.isDown) {
			// TODO
		} else if (cursors.down.isDown) {
			player[0].body.sprite.position.y += 6;
		}
		if (cursors.left.isDown) {
			player[0].body.sprite.position.x -= 4;
			player[0].dirrection = 1;
		} else if (cursors.right.isDown) {
			player[0].body.sprite.position.x += 4;
			player[0].dirrection = -1;
		}
		break;
	default: break;	
	}

	if (player[0].dirrection != temp_dir) player[0].doReflection();
	//for update position head,legs and arms
	player[0].updateBodyPartsPosition();
}

function render()
{
	// TODO check what should we do here
	//game.debug.geom(player[0].rect, player[0].color);
	//player[0].body.sprite.body = game.physics.arcade.collide(player[0], platforms);
	//console.log(player[0].body.onGround.onGround);
}
