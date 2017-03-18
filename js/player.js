/* player.js */

//Create player Phaser.game.sprite texture_names[7]-
//head 0, body 1, lArm 2, rArm 3, lLeg 4, rLeg 5, full 6
function createPlayer(game, position, color, texture_names, gravity, bounce, di)
{
	var	main_player,	// Object all sprites
		frame_rate = 10,
		p_full_sprite = game.add.sprite(position.x,
			position.y,
			texture_names),
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
		//Sprites of player here
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
			p_sprite.body.setSize(35, 107, 34, 0);
		},

		jump: function ()
		{
			if(!this.is_dead) {
				if(this.on_ground && game.time.now > this.jump_time) {
					this.body.sprite.body.velocity.y = this.jump_power;
					this.jump_time = game.time.now + 1000;
					//this.setAnimation("jump");
				}
			}
		},

		left: function ()
		{
			if(!this.is_dead) {
				this.dirrection = -1;
				this.body.sprite.body.velocity.x = - this.horizontal_velocity;
				//if(this.on_ground)
					this.setAnimation("run");
			}
		},
		
		right: function ()
		{
			if(!this.is_dead) {
				this.dirrection = 1;
				this.body.sprite.body.velocity.x = this.horizontal_velocity;
				//if(this.on_ground)
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
				this.is_dead = true;
				this.body.sprite.height /= 4;
				this.body.sprite.width /= 4;
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
			if(!this.is_dead) {
				if(this.weapon != null)
				{
					this.weapon.is_used = false;
					this.weapon.fly(this.dirrection);
				}
			}
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
				if(this.weapon != null) {
					if(!this.weapon.is_fly)
					{
						if(this.current_animation == "stay")
						{
							this.weapon.position.x = this.body.sprite.position.x+27*this.dirrection;
							this.weapon.position.y = this.body.sprite.position.y-5;
							this.weapon.rotation = 0;
							this.weapon.body.rotation = 0;
						}
						else
						{
							this.weapon.position.x = this.body.sprite.position.x+10*this.dirrection;
							this.weapon.position.y = this.body.sprite.position.y-5;
							//this.weapon.rotation = -0.5*this.dirrection;
							//this.weapon.body.rotation = -0.5*this.dirrection;
						}
					}
					this.weapon.scale.setTo(this.dirrection, 1);
				}
			}
		},
		//RotateToHorizontal
		doReflection: function()
		{
			if(!this.is_dead) {
				this.body.sprite.scale.setTo( this.dirrection, 1 );
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
	//Set start position for sprites
	main_player.updateBodyPartsPosition();

	return main_player;

}
