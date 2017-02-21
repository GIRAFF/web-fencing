/* player.js */

//  Create player Phaser.game.sprite  texture_names[6] - head, body, lArm, rArm, lLeg, rLeg
function createPlayer(game, position, color, texture_names, gravity, bounce)
{
    var main_player,	// Object all sprites
		
		p_head_sprite = game.add.sprite(position.x,
                            position.y,
                            texture_names[0]
                           ),
		/*p_body_sprite = game.add.sprite(position.x,
                            position.y,
                            texture_names[1]
                           ),
		p_lArm_sprite =  game.add.sprite(position.x,
                            position.y,
                            texture_names[2]
                           ),
		p_rArm_sprite =  game.add.sprite(position.x,
                            position.y,
                            texture_names[3]
                           ),
        p_lLeg_sprite =  game.add.sprite(position.x,
                            position.y,
                            texture_names[4]
                           ),
	    p_rLeg_sprite =  game.add.sprite(position.x,
                            position.y,
                            texture_names[5]
                           ),*/
		
	    p_head_sprite_anim = p_head_sprite.animations.add("stay", [0,1,2,3,2,1], 7, true),
		//p_body_sprite_anim = p_body_sprite.animations.add("stay",  [0,1,2,3,2,1], 5, true);

		main_player = 
		{
			head:
			{
				animation: p_head_sprite_anim,
				sprite : p_head_sprite,
			},

			/*body:
			{
				animation: p_body_sprite_anim,
				sprite : p_body_sprite
			}*/
		};
	
	init_physics( main_player.head.sprite , bounce, gravity);
	//init_physics( main_player.body.sprite , bounce, gravity);
	
    return main_player;
}

function init_physics( p , bounce, gravity)
{
	game.physics.arcade.enable(p);
	p.body.bounce.y = bounce;
	p.body.gravity.y = gravity;
	p.body.collideWorldBounds = true;
	p.body.onGround = {onGround: false};
}