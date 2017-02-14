/* main.js */

// for our Phaser.Game
var game;

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
	// TODO preload resources
}

function create()
{
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.stage.backgroundColor = "#000000";
}

function update()
{
	// TODO add some update logic
}

function render()
{
	// TODO check what should we do here
}
