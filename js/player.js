/* player.js */

//  Create player Phaser.game.sprite  texture_names[6] - head, body, lArm, rArm, lLeg, rLeg
function createPlayer(game, position, color, texture_names, gravity, bounce)
{
    var main_player,	// Object all sprites
		frame_rate = 10,

        p_lLeg_sprite =  game.add.sprite(position.x,
                            position.y,
                            texture_names[4]
                           ),
	    p_rLeg_sprite =  game.add.sprite(position.x,
                            position.y,
                            texture_names[5]
                           ),
		p_body_sprite = game.add.sprite(position.x,
                            position.y,
                            texture_names[1]
                           ),
		p_head_sprite = game.add.sprite(position.x,
                            position.y,
                            texture_names[0]
                           ),
		/*p_lArm_sprite =  game.add.sprite(position.x,
                            position.y,
                            texture_names[2]
                           ),
		p_rArm_sprite =  game.add.sprite(position.x,
                            position.y,
                            texture_names[3]
                           ),
						   */
		
	    p_head_sprite_anim = p_head_sprite.animations.add("stay", [0,1,2,3,2,1], frame_rate, true),
		p_body_sprite_anim = p_body_sprite.animations.add("stay",  [0,1,2,3,2,1], frame_rate, true),
		p_left_leg_sprite_anim = p_lLeg_sprite.animations.add("stay",  [0,1], frame_rate/2, true),
		p_right_leg_sprite_anim = p_rLeg_sprite.animations.add("stay",  [0,1], frame_rate/2, true);

		main_player = {
			head: {
				animation: p_head_sprite_anim,
				sprite : p_head_sprite,
			},

			body: {
				animation: p_body_sprite_anim,
				sprite : p_body_sprite
			},

			leg_left: {
				animation: p_left_leg_sprite_anim,
				sprite: p_lLeg_sprite
			},

			leg_right: {
				animation: p_right_leg_sprite_anim,
				sprite: p_rLeg_sprite
			}
		};

	// Enable physics for sprite
	//init_physics( main_player.head.sprite , bounce, gravity);
	//initPhysics( main_player.body.sprite , bounce, gravity);
	initPhysics( main_player.leg_left.sprite, bounce, gravity);
	initPhysics( main_player.leg_right.sprite, bounce, gravity);
	//Set start position for sprites
	positionBodyParts( main_player );
    return main_player;
}



function positionBodyParts(p)
{
	p.head.sprite.position.x = p.body.sprite.position.x - p.head.sprite.width/2>>0;
	p.head.sprite.position.y = p.body.sprite.position.y - p.head.sprite.height/2>>0;
	p.body.sprite.position.x = p.leg_left.sprite.position.x + 13;
	p.body.sprite.position.y = p.leg_left.sprite.position.y - p.body.sprite.height + 20;
	p.leg_right.sprite.position.y = p.body.sprite.position.y + p.body.sprite.height - 20;
	p.leg_right.sprite.position.x = p.body.sprite.position.x + p.body.sprite.width - 8;
}

function initPhysics( p , bounce, gravity)
{
	game.physics.arcade.enable(p);
	p.body.bounce.y = bounce;
	p.body.gravity.y = gravity;
	p.body.collideWorldBounds = true;
	p.body.onGround = {onGround: false};
}