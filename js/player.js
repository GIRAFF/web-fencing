/* player.js */

/*
This future class player...

class Player
{
	constructor(game, position, color, texture_name, gravity, bounce, dir)
	{
		this.dirrection = dir;
		this.jump_velocity = 2350;
		this.horizontal_velocity = 9000;
		this.jump_time = 0;
		this.move_time = 0;
		this.on_ground = false;
		
	}
}
*/

function createPlayer(game, position, color, texture_names, gravity, bounce, di)
{
	var	main_player,	// Object all sprites
		frame_rate = 10,
		p_full_sprite = game.add.sprite(position.x,
			position.y,
			texture_names),
		t0 = p_full_sprite.animations.add("stay2", 
		[0,1], frame_rate/5, true),
		t1 = p_full_sprite.animations.add("stay1", 
		[18,19], frame_rate/5, true),
		t2 = p_full_sprite.animations.add("stay0", 
		[20,21], frame_rate/5, true),
		t3 = p_full_sprite.animations.add("run_with_weapon",
		 [2,3,4,5,6,7,8,9], frame_rate, true),
		t4 = p_full_sprite.animations.add("run_no_weapon", 
		[10, 11, 12, 13, 14, 15, 16, 17], frame_rate, true);

		p_full_sprite.anchor.set(0.5, 0.5);
			
	//Class Player, add properties here
	main_player = {
		//Properties here
		dirrection: di, // 1 - left, -1 - right 
		jump_power: 2350,
		right_left_power:9000,
		jump_time: 0,
		move_time: 0,
		weapon_time: 0,
		death_time: 0,
		on_ground: false,
		horizontal_velocity: 400,
		is_dead: false,
		current_animation: "stay1",
		weapon: null, //  weapon by player
		weapon_position: 1,
		//Sprites of player here
		body: {
			animation: {
				stay2: t0,
				stay1: t1,
				stay0: t2,
				run_with_weapon: t3,
				run_no_weapon: t4
				
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
			p_sprite.body.setSize(50, 95, 25, 66);
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
					
				if(this.weapon == null)	{
					this.setAnimation("run_no_weapon");
				}
				else {
					this.setAnimation("run_with_weapon");
				}
			}
		},
		
		right: function ()
		{
			if(!this.is_dead) {
				this.dirrection = 1;
				this.body.sprite.body.velocity.x = this.horizontal_velocity;
				//if(this.on_ground)
				if(this.weapon == null)	{
					this.setAnimation("run_no_weapon");
				}
				else {
					this.setAnimation("run_with_weapon");
				}
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
				this.weapon_position = 2;
				this.death_time = game.time.now + 3000;
				this.setAnimation("stay2");
				this.body.sprite.tint = 0xFF0000;
				this.body.sprite.visible = false;
			}
		},
		respawn: function(position, dir)
		{
			this.is_dead = false;
			createWeapon(weapons, "weaponTexture", 1000, { x:this.body.sprite.position.x, y:this.body.sprite.position.y});
			this.takeWeapon(weapons.children[weapons.children.length-1]);
			//this.body.sprite.height *= 4;					
			//this.body.sprite.width *= 4;	
			this.body.sprite.visible = true;
			this.body.sprite.position.x = position.x + 300 * dir;
			this.body.sprite.position.y = position.y;
		},
		//Атака в трёх положениях
		attackSimple: function ()
		{
			if (!this.is_dead && this.weapon != null && game.time.now > this.weapon_time){
				this.weapon.body.position.x += 60*this.dirrection;
				this.weapon_time = game.time.now + 300;
			}
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
			this.setAnimation("stay" + this.weapon_position);
		},

		save: function ()
		{
			// Save all player properties here
			
		},

		//Move secondary sprites to main sprite ( main sprites it is body С: )
		updateBodyPartsPosition: function()
		{	
			if(!this.is_dead) {
				if(this.body.sprite.body.velocity.x == 0)
					this.setAnimation("stay"+ this.weapon_position);
				if(this.weapon != null) {
					if(!this.weapon.is_fly)
					{
						if(this.current_animation == ( "stay" + this.weapon_position) )
						{
							this.weapon.position.x =
							 	this.body.sprite.position.x+10*this.dirrection;
							this.weapon.position.y =
								this.body.sprite.position.y+22*(this.weapon_position-1);
							this.weapon.rotation = 0;
							this.weapon.body.rotation = 0;
							this.weapon.alpha = 1;
						}
						else
						{
							this.weapon.position.x = 
								this.body.sprite.position.x-18*this.dirrection;
							this.weapon.position.y = this.body.sprite.position.y-5;
							this.weapon.width = 0;
							this.weapon.height = 0;
							this.weapon.alpha = 0;
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
		},

		unsignedMod: function uMod(number, Limit)
		{
 			  if(number > 0) return number%Limit; 
              if(number < 0) return Limit + number%Limit; 
              
              return 0; 
		},

		weaponPositionUpdate: function (change)
		{
			if (1 == Math.abs(change)) {
				if ( game.time.now > this.weapon_time ) {
					if(change == -1 && this.weapon_position > 0)
						this.weapon_position = 
							this.unsignedMod(this.weapon_position + change, 3);
					else
						if(change == 1 && this.weapon_position < 2)
							this.weapon_position = 
							this.unsignedMod(this.weapon_position + change, 3);
					this.weapon_time = game.time.now + 300;
				}
			}                           
			console.log(this.weapon_position);
		}
	};

	// Enable physics for sprites
	main_player.initPhysics(main_player.body.sprite, bounce, gravity);

	//Set start position for sprites
	main_player.updateBodyPartsPosition();

	return main_player;

}
