/* player.js */

//  Create player Phaser.game.sprite
function create_Player(game, position, color, texture_name, gravity, bounce)
{
    var p = game.add.sprite(position.x,
                            position.y,
                            texture_name
                           );

	game.physics.arcade.enable(p);
	p.body.bounce.y = bounce;
	p.body.gravity.y = gravity;
	p.body.collideWorldBounds = true;
	p.body.onGround = {onGround: false};
	p.body.maxVelocity = { x: 99999, y: 99999}; 

    return p;
}