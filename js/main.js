/* main.js */
// for our Phaser.Game
var game,
	gm;

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
	// load weapon texture
	game.load.spritesheet("weaponTexture",
		"assets/rapire.png", 81, 9, 1, 0, 0); // sword
	game.load.spritesheet("weaponTextureRotate",
		"assets/rapire_rotate.png", 81, 81, 8, 0, 0); // sword_rotate
	// load player texture	
	game.load.spritesheet("bg", "assets/bg.png", 800, 600, 62, 0, 0);
	game.load.spritesheet("player1",
		"assets/pr00.png", 130, 163, 29, 6, 6);//player
	game.load.spritesheet("player2",
		"assets/pr01.png", 130, 163, 29, 6, 6);//player
	game.load.image("win", "assets/win.png", true);
	game.load.image("blood", "assets/blood.png", true);
    game.load.image("tex1", "assets/tex1.png", true);
    game.load.image("tex2", "assets/tex2.png", true);
	game.load.image("textCamera", "assets/camera.png");
	/*game.load.audio("sound",
		"assets/MainThemev2.wav", true);*/
	//game.load.image("test1", "assets/test1_v2.0.png");
}

function create()
{
	//Внимание!!! Последовательность операций важна
	game.physics.startSystem(Phaser.Physics.ARCADE);
	//game.world.setBounds(0, 0, 35000, 600);
	game.world.setBounds(0, 0, 4800, 600);

	gm = new GameManager(game);
	gm.mapInit("bg");
	game.world.bringToTop(gm.weapon_group);
	gm.gravity = 800;
	gm.bounce = 0.0;
	/*gm.addPlayer(game, {x:17200, y:200}, "player1", 0xFFFFFF, 1);
	gm.addPlayer(game, {x:17800, y:200}, "player2", 0xFFFFFF, -1);*/
	gm.addPlayer(game, {x:2100, y:200}, "player1", 0xFFFFFF, 1);
	gm.addPlayer(game, {x:2700, y:200}, "player2", 0xFFFFFF, -1);
	gm.player[0].takeWeapon(gm.spawnWeapon( {x:2100, y: 210}, 1));
	gm.spawnWeapon( {x:2700, y: 210}, -1);
	gm.cameraInit(game, "textCamera");
}

function update() 
{
	//Внимание, не переставляйте местами вызовы функций, это очень опасно!
	gm.collidePlayerPlatforms(game);
	gm.collideWeaponsPlatform(game)
	gm.weaponsUpdate(game);
	gm.playersWeaponsUpdate(game);
	gm.playersUpdate(game, "win");
	gm.controlInput(game, 1, gm.input.player1);
	gm.controlInput(game, 0, gm.input.player2);
	gm.cameraUpdate(game);
	gm.playerPlayerEffects(game)
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
		for (var i = 0; i < gm.platforms.children.length; i++) {
			let line = new Phaser.Line(gm.platforms.children[i].position.x,
			gm.platforms.children[i].position.y, gm.platforms.children[i].position.x +
			gm.platforms.children[i].width, gm.platforms.children[i].position.y + gm.platforms.children[i].height);
			game.debug.geom(line);
			game.debug.rectangle(line);
		}

			let line = new Phaser.Line(gm.camera.position.x,
			gm.camera.position.y, gm.camera.position.x +
			gm.camera.width, gm.camera.position.y + gm.camera.height);
			game.debug.geom(line);
			game.debug.rectangle(line);
	}
}
