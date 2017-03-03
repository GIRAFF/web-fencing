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
		{ font: "20px UnifrakturMaguntia", fill: "#fac" },
		{ font: "100px UnifrakturMaguntia", fill: "#ff3" }
	],
	//use it for all the keyboard input
	input =
	{
		cursors: null,
		esc: null
	}, 
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
	game.load.script('webfont',
		'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
	//load player texture
	game.load.spritesheet("playerHeadSpriteSheet",
		"assets/headSpriteSheet.png", 26, 48, 4, 0, 0);//head
	game.load.spritesheet("playerBodySpriteSheet",
		"assets/bodySpriteSheet0.png", 27, 116, 4, 0, 0);//body
	game.load.spritesheet("playerLegLeftSpriteSheet",
		"assets/leftLegSpriteSheet.png", 19, 43, 2, 0, 0);//legs right
	game.load.spritesheet("playerLegRightSpriteSheet",
		"assets/rightLegSpriteSheet.png", 14, 45, 2, 0, 0);//legs right
}

function create()
{

	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.stage.backgroundColor = "#000";

	// keyboard control
    input.cursors = game.input.keyboard.createCursorKeys();
	input.esc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
	input.esc.onDown.add(function()
		{
			switch (curr_state) {
			case game_state.GAME:
				curr_state = game_state.PAUSE;
			break;
			case game_state.PAUSE:
				curr_state = game_state.GAME;
			break;
			}
		});
	platforms = game.add.group();
	//  We will enable physics for any object that is created in this group
	platforms.enableBody = true;
	var ground = platforms.create(0, game.world.height - 40, "a");
	ground.scale.setTo(40, 1);
    ground.body.immovable = true;
	// for game world size more than screen size
	//game.world.setBounds( -1000, -1000, 1000, 1000);
	game.world.setBounds( 0, 0, 800, 600);

	text = game.add.text(game.world.centerX,
		game.world.centerY,
		"this game",
		styles[1]);
	
	// Player 1 init
	player.push(createPlayer(game, {x:200, y:10}, "#fac",
		["playerHeadSpriteSheet",
			"playerBodySpriteSheet",
			"playerHandLeftSpriteSheet",
			"playerHandRightSpriteSheet",
			"playerLegLeftSpriteSheet",
			"playerLegRightSpriteSheet"], 300, 0.1));
	// Player 2 init	
	player.push(createPlayer(game, {x:100, y:10}, "#fac",
		["playerHeadSpriteSheet",
			"playerBodySpriteSheet",
			"playerHandLeftSpriteSheet",
			"playerHandRightSpriteSheet",
			"playerLegLeftSpriteSheet",
			"playerLegRightSpriteSheet"], 300, 0.1));
}

function update()
{
	//Save dirrection player for scale
	var temp_dir = [];
		for(var i = 0; i < player.lengthl; i++)
			temp_dir.push(player[i].dirrection);


	switch (curr_state) {
	case game_state.GAME:
		//animation stay
		if (input.cursors.up.isDown ||
			input.cursors.down.isDown ||
			input.cursors.left.isDown ||
			input.cursors.right.isDown) {
			// TODO set to run
			for(var i = 0; i < player.lengthl; i++)
				player[i].setAnimation("stay");
			
			//player[0].setAnimation("stay");
		}

		if (input.cursors.up.isDown) {
			player[0].jump();
		} else if (input.cursors.down.isDown) {	}

		if (input.cursors.left.isDown) {
			player[0].left();
		} else if (input.cursors.right.isDown) {
			player[0].right();
		}

		break;
	case game_state.PAUSE:
		// TODO fade
		text = game.add.text(game.world.centerX - 200,
			game.world.centerY,
			"Press ESC to contunue",
			styles[0]);
	break;
	default: break;	
	}

	for(var i = 0; i < player.length; i++)
	{
		player[i].on_ground =  game.physics.arcade.collide(
			player[i].body.sprite, platforms);
		//for update position head,legs and arms
		if (player[i].dirrection != temp_dir[i]) player[i].doReflection();
			player[i].updateBodyPartsPosition();
	}
}

function render()
{
	// TODO check what should we do here
	/*console.log("COLL - " + player[0].on_ground +
			    "; TOUCHING - " + player[0].body.sprite.body.touching.down);*/
	//console.log("TOUCHING"+player[0].body.sprite.body.touching.down);
}
