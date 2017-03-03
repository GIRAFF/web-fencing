/* player.js */

//  Create player Phaser.game.sprite texture_names[6]:
//  head, body, lArm, rArm, lLeg, rLeg
function createPlayer(game, position, color, texture_names, gravity, bounce)
{
	var	main_player,	// Object all sprites
		frame_rate = 10,
		p_lLeg_sprite = game.add.sprite(position.x,
			position.y,
			texture_names[4]),
		p_rLeg_sprite = game.add.sprite(position.x,
			position.y,
			texture_names[5]),
		p_body_sprite = game.add.sprite(position.x,
			position.y,
			texture_names[1]),
		p_head_sprite = game.add.sprite(position.x,
			position.y,
			texture_names[0]),
		/*
			p_lArm_sprite = game.add.sprite(position.x,
											position.y,
											texture_names[2]),
			p_rArm_sprite = game.add.sprite(position.x,
											position.y,
											texture_names[3]),
											*/

		//Create animation here
		p_head_sprite_anim = p_head_sprite.animations.add(
			"stay",
			[0,1,2,3,2,1],
			frame_rate,
			true),
		p_body_sprite_anim = p_body_sprite.animations.add(
			"stay",
			[0,1,2,3,2,1],
			frame_rate,
			true),
		p_left_leg_sprite_anim = p_lLeg_sprite.animations.add(
			"stay",
			[0,1,1],
			frame_rate/2,
			true),
		p_right_leg_sprite_anim = p_rLeg_sprite.animations.add(
			"stay",
			[0,1,1],
			frame_rate/2,
			true);

	//Class Player, add properties here
	main_player = {
		//Properties here
		dirrection: 1, // 1 - left, -1 - right 
		//Sprites of player here
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
		},
		//Methods here
		//Add physics to sprite (head, body, ...)
		initPhysics: function( p_sprite , bounce, gravity)
		{
			game.physics.arcade.enable(p_sprite);
			p_sprite.body.bounce.y = bounce;
			p_sprite.body.gravity.y = gravity;
			p_sprite.body.collideWorldBounds = true;
			p_sprite.body.onGround = {onGround: false};
		},
		//Move secondary sprites to main sprite ( main sprites it is legs С: )
		updateBodyPartsPosition: function()
		{	//Head relative position
			this.head.sprite.position.x =
				this.body.sprite.position.x - this.head.sprite.width / 3 >> 0;
			this.head.sprite.position.y = this.body.sprite.position.y;

			if (this.dirrection == 1) {    //If left dirrect
				this.leg_left.sprite.position.x =
					this.body.sprite.position.x -
					this.leg_left.sprite.width + 10;
				this.leg_left.sprite.position.y = this.body.sprite.position.y +
					this.body.sprite.height - this.leg_left.sprite.height;

				this.leg_right.sprite.position.y =
					this.leg_left.sprite.position.y;
				this.leg_right.sprite.position.x =
					this.body.sprite.position.x +
					this.body.sprite.width - 
					this.leg_right.sprite.width + 7;
			} else { //If right dirrect
				this.leg_left.sprite.position.x =
					this.body.sprite.position.x + 10;
				this.leg_left.sprite.position.y = this.body.sprite.position.y +
					this.body.sprite.height -
					this.leg_left.sprite.height;
				this.leg_right.sprite.position.y =
					this.leg_left.sprite.position.y;
				this.leg_right.sprite.position.x =
					this.body.sprite.position.x + 
					this.leg_right.sprite.width - 8;
			}

		},
		//RotateToHorizontal
		doReflection: function()
		{
			this.head.sprite.scale.setTo( this.dirrection, 1 );
			this.body.sprite.scale.setTo( this.dirrection, 1 );
			this.leg_left.sprite.scale.setTo( this.dirrection, 1 );
			this.leg_right.sprite.scale.setTo( this.dirrection, 1 );

		},
		//All animation of player here !
		setAnimation: function( animation_name )
		{
			this.head.animation.enableUpdate = true;
			this.head.animation.play( animation_name, 30, true);
			this.body.animation.enableUpdate = true;
			this.body.animation.play(animation_name, 4, true);
			this.leg_left.animation.play(animation_name, 4, true);
			this.leg_right.animation.play(animation_name, 4, true);
		},

		debugInfoToConsole: function()
		{
			console.log("head.x = %d, head.y = %d, \
							 body.x = %d, body.y = %d, \
							 legL.x = %d, legL.y = %d, \
							 legR.x = %d, legR.y = %d",
				this.head.sprite.position.x, this.head.sprite.position.y,
				this.head.sprite.position.x, this.head.sprite.position.y,
				this.leg_left.sprite.position.x,
				this.leg_left.sprite.position.y,
				this.leg_right.sprite.position.x,
				this.leg_right.sprite.position.y);
		}
	};

	// Enable physics for sprites
	main_player.initPhysics( main_player.body.sprite, bounce, gravity);
	//Set start position for sprites
	main_player.updateBodyPartsPosition();
	//positionBodyParts( main_player );
	return main_player;
}
