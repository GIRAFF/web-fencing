/* main.js */
// for our Phaser.Game
var isdebug = true,
	game,
	gm,
	game_state = {
		MENU: 0,
		CONFIG: 1,
		PAUSE: 2,
		GAME: 3
	},
	curr_state = game_state.GAME,
	text,
	createText,
	sound,
	camera, 
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
	gravity = 300, //global player gravity
	wasd = {},
	weapons, // all weapons
	win_or_lose_dir = 0, // -1 - left, 0 - nothing, 1 - right
	current_winner_label;

// script for loading fonts from google fonts.
/*
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
*/
function init()
{
	game = new Phaser.Game(1200, 600, Phaser.CANVAS, "game", {
		preload: preload,
		create: create,
		update: update,
		render: render
	});

}

function preload()
{
	// loading font from google fonts too long loading !!!
	/*
	game.load.script('webfont',
		'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
	*/
	// load weapon texture
	game.load.spritesheet("weaponTexture",
		"assets/rapire.png", 81, 9, 1, 0, 0); // sword
	game.load.spritesheet("weaponTextureRotate",
		"assets/rapire_rotate.png", 81, 81, 8, 0, 0); // sword_rotate
	// load player texture
	/*game.load.spritesheet("player1",
		"assets/AnimationRun_v1_1.png", 98, 107, 10, 6, 6);//player
*/

game.load.spritesheet("player1",
		"assets/pr00.png", 130, 163, 22, 6, 6);//player

game.load.spritesheet("player2",
		"assets/pr01.png", 130, 163, 22, 6, 6);//player


	/*game.load.audio("sound",
		"assets/MainThemev2.wav", true);*/
	//game.load.image("test1", "assets/test1_v2.0.png");
}

function create()
{
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.stage.backgroundColor = "#000";
	game.world.setBounds(0, 0, 5000, 600);

	gm = new GameManager(game);
	gm.cameraInit(game);
	gm.gravity = 800;
	gm.bounce = 0.3;
	gm.addPlayer(game, {x:100, y:200}, "player1", 0xFFFFFF, 1);
	gm.addPlayer(game, {x:1100, y:200}, "player2", 0xFFFFFF, -1);
	gm.spawnWeapon( {x:110, y: 210}, 1);
	gm.spawnWeapon( {x:1085, y: 210}, -1);

	text = game.add.text(game.world.centerX,
		game.world.centerY,
		"this game",
		styles[1]);
}

function update() 
{
	gm.collidePlayerPlatforms(game);
	gm.collideWeaponsPlatform(game)
	gm.weaponsUpdate(game);
	gm.playersWeaponsUpdate(game);

	gm.controlInput(game, 1, gm.input.player1);
	gm.controlInput(game, 0, gm.input.player2);
	gm.cameraUpdate(game);
}


function render()
{
	if (gm.is_debug) {
		for (var i = 0; i < gm.player.length; i++) {
			game.debug.geom(gm.player[i].line_debug);
			game.debug.rectangle(gm.player[i].line_debug);		
		}
		for (var i = 0; i < gm.weapon_list.length; i++) {
			game.debug.geom(gm.weapon_list[i].line_debug);
			game.debug.rectangle(gm.weapon_list[i].line_debug);
		}
	}
}