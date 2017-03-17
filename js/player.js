/* player.js */

//Create player Phaser.game.sprite texture_names[7]-
//head 0, body 1, lArm 2, rArm 3, lLeg 4, rLeg 5, full 6
function createPlayer(game, position, color, texture_names, gravity, bounce, di)
{
	var	main_player,	// Object all sprites
		frame_rate = 10,
		/*p_lLeg_sprite = game.add.sprite(position.x,
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
			texture_names[0]),*/
		p_full_sprite = game.add.sprite(position.x,
			position.y,
			texture_names),
		/*
			p_lArm_sprite = game.add.sprite(position.x,
											position.y,
											texture_names[2]),
			p_rArm_sprite = game.add.sprite(position.x,
											position.y,
											texture_names[3]),
											*/

		//Create animation here
		/*p_head_sprite_anim = p_head_sprite.animations.add(
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
			true);*/
		p_full_sprite_anim = p_full_sprite.animations.add("stay", [0,1],
		frame_rate/5, true);
		var t = p_full_sprite.animations.add("run", [2,3,4,5,6,7,8,9], 
		frame_rate, true);
		p_full_sprite.anchor.set(0.5, 0.5);
			
	//Class Player, add properties here
	main_player = {
		//Properties here
		dirrection: di, // 1 - left, -1 - right 
		jump_power: 2300,
		right_left_power:9000,
		jump_time: 0,
		move_time: 0,
		on_ground: false,
		horizontal_velocity: 400,
		is_dead: false,
		current_animation: "stay",
		weapon: null, //  weapon by player
		/*rectangle: new Phaser.Rectangle(p_body_sprite.position.x, 
			p_body_sprite.position.y, p_body_sprite.width, p_body_sprite.height),*/
		rectangle: new Phaser.Rectangle(p_full_sprite.position.x, 
		p_full_sprite.position.y, p_full_sprite.width, p_full_sprite.height),	
		//Sprites of player here
		/*head: {
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
		},*/
		body: {
			animation: {
				stay:p_full_sprite_anim,
				run:t
			},
			sprite: p_full_sprite
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

		jump: function ()
		{
			if(!this.is_dead) {
				if(this.on_ground && game.time.now > this.jump_time) {
					this.body.sprite.body.velocity.y = this.jump_power;
					this.jump_time = game.time.now + 1000;
					this.setAnimation("jump");
				}
			}
		},

		left: function ()
		{
			if(!this.is_dead) {
				this.dirrection = -1;
				this.body.sprite.body.velocity.x = - this.horizontal_velocity;
				this.setAnimation("run");
			}
		},
		
		right: function ()
		{
			if(!this.is_dead) {
				this.dirrection = 1;
				this.body.sprite.body.velocity.x = this.horizontal_velocity;
				this.setAnimation("run");
			}
		},
		// Поднять оружие
		takeWeapon: function (w)
		{
			if(!this.is_dead) {
				if(this.weapon == null )
				{
					if(w != null && !w.is_used) {
						this.weapon = w;
						this.weapon.is_used = true;
						this.weapon.body.enable = true;
						this.weapon.body.gravity.y = 0;
					}
				}
			}
		},
		// Уронить оружие
		throwWeapon: function (gravity)
		{
			if(!this.is_dead) {
				if(this.weapon != null) {
					this.weapon.body.enable = true;
					if(gravity != null)
						this.weapon.body.gravity.y = gravity;
					else
						this.weapon.body.gravity.y = 800;
					
					this.weapon.is_used = false;
					this.weapon = null;
				}
			}
		},
		// Умереть...
		die: function()
		{
			if(!this.is_dead) {
				this.throwWeapon(1000);
				this.initPhysics(this.head.sprite, 0.3, 300);
				this.initPhysics(this.leg_left.sprite, 0.4, 300);
				this.initPhysics(this.leg_right.sprite, 0.4, 300);
				this.is_dead = true;
				this.body.sprite.height /= 2;
			}
		},
		//Атака в трёх положениях
		attackSimple: function ()
		{
			if(!this.is_dead) {}
		},
		//Атака броском
		attackThrow: function()
		{
			if(!this.is_dead) {}
		},

		stay: function ()
		{
			this.setAnimation("stay");
		},

		save: function ()
		{
			// Save all player properties here
		},

		//Move secondary sprites to main sprite ( main sprites it is legs С: )
		updateBodyPartsPosition: function()
		{	
			if(!this.is_dead) {
				if(this.body.sprite.body.velocity.x == 0)
					this.setAnimation("stay");
				
				/*this.rectangle.x = this.body.sprite.position.x;
				this.rectangle.y = this.body.sprite.position.y;
				this.rectangle.width = Math.abs(this.body.sprite.width);
				this.rectangle.height =  Math.abs(this.body.sprite.height);

				//Head relative position
				this.head.sprite.position.x =
					this.body.sprite.position.x - this.head.sprite.width / 3 >> 0;
				this.head.sprite.position.y = this.body.sprite.position.y;
*/
				if(this.weapon != null) {
					this.weapon.position.y =
					//this.head.sprite.height + this.head.sprite.position.y;
					this.weapon.position.x = 
					//this.head.sprite.position.x - this.head.sprite.width;
					this.weapon.scale.setTo(this.dirrection, 1);
				}

				/*if (this.dirrection == 1) {    //If left dirrect
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
				}*/
			}
		},
		//RotateToHorizontal
		doReflection: function()
		{
			if(!this.is_dead) {
				//this.head.sprite.scale.setTo( this.dirrection, 1 );
				this.body.sprite.scale.setTo( this.dirrection, 1 );
				//this.leg_left.sprite.scale.setTo( this.dirrection, 1 );
				//this.leg_right.sprite.scale.setTo( this.dirrection, 1 );
			}
		},
		//All animation of player here !
		setAnimation: function( animation_name )
		{
			if(this.current_animation != animation_name)
			{
				this.current_animation = animation_name;
				this.body.animation[animation_name].play(animation_name, 9, true);
			}
		}
	};

	// Enable physics for sprites
	main_player.initPhysics(main_player.body.sprite, bounce, gravity);
	//main_player.initPhysics(main_player.leg_left.sprite, 0, 0);
	//main_player.initPhysics(main_player.leg_right.sprite, 0, 0);
	//Set start position for sprites
	main_player.updateBodyPartsPosition();

	return main_player;

}
