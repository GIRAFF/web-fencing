/* player.js */


class Player
{
	// Constructor
	constructor(game, position, color, texture_name, gravity, bounce, dir)
	{
	
	this.velocities = {	jump: -500, horizontal_velocity: 500 };
	this.times = { move: 0, jump: 0, death: 0, weapon: 0};
	this.flags = { on_ground: false, is_dead: false	};
	this.body = { animation: null, sprite: null	};

		// Init phaser sprite
	this.body.sprite = game.add.sprite(position.x, position.y, texture_name);
	this.body.sprite.tint = color;
		// Init Animation
	this.animation_velocity = 12;

	this.body.animation =  {
		stay2: this.body.sprite.animations.add("stay2",
					[0,1], this.animation_velocity/5, true),
		stay1: this.body.sprite.animations.add("stay1",
					[18,19], this.animation_velocity/5, true),
		stay0: this.body.sprite.animations.add("stay0",
					[20,21], this.animation_velocity/5, true),
		run_with_weapon: this.body.sprite.animations.add("run_with_weapon",
					 [2,3,4,5,6,7,8,9], this.animation_velocity, true),
		run_no_weapon: this.body.sprite.animations.add("run_no_weapon", 
				[10, 11, 12, 13, 14, 15, 16, 17], this.animation_velocity, true)
		};


	this.body.animation["stay-1"] = this.body.sprite.animations.add("stay0", 
		[20,21], this.animation_velocity/5, true),

	this.dirrection = dir;
	this.current_animation = "stay1";
	this.weapon = null;
	this.weapon_position = 1;
	this.line_debug = new Phaser.Line(0,0,0,0);

	this.initPhysics(bounce, gravity);
	}

	initPhysics(gravity, bounce)
	{
		game.physics.arcade.enable(this.body.sprite);
		this.body.sprite.body.bounce.y = bounce;
		this.body.sprite.body.gravity.y = gravity;
		this.body.sprite.body.setSize(30, 100, 35, 61);
		this.body.sprite.anchor.setTo(0.5, 0.5);
	}

	jump()
	{
	if (!this.flags.is_dead) {
			if(this.flags.on_ground && game.time.now > this.times.jump) {
				this.body.sprite.body.velocity.y = this.velocities.jump;
				this.times.jump = game.time.now + 1000;
				//this.setAnimation("jump");
			}
		}
	}

	left()
	{
	if (!this.flags.is_dead) {
		this.dirrection = -1;
		this.body.sprite.body.velocity.x = -this.velocities.horizontal_velocity;
		if (this.weapon == null)	
			this.setAnimation("run_no_weapon");
		else 
			this.setAnimation("run_with_weapon");
		}
	}

	right()
	{
	if (!this.flags.is_dead) {
		this.dirrection = 1;
		this.body.sprite.body.velocity.x = this.velocities.horizontal_velocity;
		if (this.weapon == null)	
			this.setAnimation("run_no_weapon");
		else 
			this.setAnimation("run_with_weapon");
		}
	}

	takeWeapon(w)
	{
	if (!this.flags.is_dead) 
		if (this.weapon == null )
			if (w != null && !w.flags.is_used) 
				this.weapon = w.getWeapon();		
	}

	dropWeapon()
	{
	if (!this.flags.is_dead) 
		if (this.weapon != null) 
			this.weapon = this.weapon.dropWeapon();		
	}

	die()
	{
	if (!this.flags.is_dead) {
		this.dropWeapon();
		this.weapon_position = 2;
		this.times.death = game.time.now + 3000;
		this.setAnimation("stay2");
		this.body.sprite.visible = false;
		this.body.sprite.body.enable = false;
		this.flags.is_dead = true;
		}
	}

	spawn(position, dir)
	{
		this.body.sprite.visible = true;
		this.body.sprite.position.x = position.x;
		this.body.sprite.position.y = position.y;
		this.body.sprite.body.enable = true;
		this.dirrection = dir;
		this.flags.is_dead = false;	
	}

	attackSimple()
	{
	if (!this.flags.is_dead && this.weapon != null)
		if ( game.time.now > this.times.weapon) {
			this.weapon.attackSimple();
			this.times.weapon = game.time.now + 300;
			}
	}

	attackThrow()
	{
		if (this.weapon != null && this.weapon_position == -1) {
			this.weapon = this.weapon.fly(this.dirrection);
		}
	}

	stay()
	{
		this.setAnimation("stay" + this.weapon_position);
	}

	doReflection()
	{
		this.body.sprite.scale.setTo(this.dirrection, 1);
	}

	setAnimation( animation_name )
	{
	if (this.current_animation != animation_name) {
		this.current_animation =animation_name;
		this.body.animation[animation_name].play(animation_name);
		}
	}

	upDownArm( change )
	{
	if ( game.time.now > this.times.weapon ) {
		if ( change == -1 && this.weapon_position > -1)
			this.weapon_position += change;
		else
			if ( change == 1 && this.weapon_position < 2)
				this.weapon_position += change;
		this.times.weapon = game.time.now + 300;
		}              
	}

	debug()
	{
	this.line_debug.setTo(this.body.sprite.body.position.x,
		this.body.sprite.body.position.y,
		this.body.sprite.body.position.x +
		this.body.sprite.body.width,
		this.body.sprite.body.position.y +
		this.body.sprite.body.height);
	}

	update()
	{
	if (!this.flags.is_dead) {
		this.debug();

	if (this.body.sprite.body.velocity.x == 0)
		this.setAnimation("stay"+ this.weapon_position);

	
	this.body.sprite.scale.setTo(this.dirrection, 1);
		}
	}
	///************************************************
}