class Weapon
{
    constructor ( game_group, texture_name, gravity, bounce, position)
    {
        this.sprite = game_group.create(position.x, position.y, texture_name);
		
		this.animation = null;
		
        this.positions = { };
        this.positions["p-1"] = -20;
        this.positions["p0"] = 4;
        this.positions["p1"] = 22;
        this.positions["p2"] = 40;

        this.flags = { 
            on_ground: false,
            is_used: false,
            is_fly: false,
            is_attack: false
        };

        this.velocities = {
            fly_velocity: 800,
            horizontal_velocity: 9000
        };
    
        this.times = {
            attack: 0
        };
		
		this.animation_velocity = 30;
		this.animation =  {
			stay:  this.sprite.animations.add("stay",
						[0], 0, true),
			fly: this.sprite.animations.add("fly",
						[1,2,3,4,5,6,7,8], this.animation_velocity, true),
			
		};

        this.temp = 0;
        this._gravity = gravity;
        this.line_debug = new Phaser.Line(0,0,1,0);
        this.dirrection = 1;
        this.initPhysics(gravity, bounce);
        this.lenght_rapire = 50;
        this.offset_rapire = 0;
    }

	debug()
	{
	this.line_debug.setTo(this.sprite.body.position.x,
		this.sprite.body.position.y,
		this.sprite.body.position.x +
		this.sprite.body.width,
		this.sprite.body.position.y +
		this.sprite.body.height);
	}

    initPhysics(gravity, bounce)
	{
        this.sprite.body.bounce.y = bounce;
        this.sprite.body.gravity.y = gravity;
        this.sprite.body.setSize(81, 9);
	}

    getWeapon()
    {
        if(this.flags.on_ground) {
            this.sprite.body.immovable = true;
            this.sprite.body.gravity.y = 0;
            this.flags.is_used = true;

        return this;
        } else return null;
    }

    dropWeapon()
    {        
		this.animation["stay"].play("stay");
        this.sprite.body.immovable = false;
        this.flags.on_ground = false;
        this.flags.is_used = false;
        this.flags.is_fly = false;
        this.sprite.body.velocity.x = 0;
        this.sprite.body.gravity.y = this._gravity;
        this.sprite.alpha = 1;
        this.sprite.body.height = 9;
        return null;
    }

    attackDirectionUpdate(dirrection_player)
    {
         if(this.flags.is_attack) {
            this.sprite.body.velocity.x = 500*dirrection_player;
            }
    }

    update()
    {
        this.debug();
             if (this.flags.is_fly) {
                if(!(this.sprite.body.touching.none && this.flags.is_fly))
                    this.dropWeapon();
                   // this.sprite.body.velocity.y = -this._gravity*2;
            }
    }

    attackSimple()
    {
         this.flags.is_attack = true;
         this.times.attack = game.time.now + 1000;

        	if ( game.time.now > this.times.attack) {
                this.flags.is_attack = false;
            } 

    }

    setPositionY( change, playerY ) 
    {
        this.sprite.position.y = playerY + this.positions[change];
    }

    fly(dir)
    {
        this.dropWeapon();		
		this.animation["fly"].play("fly");
        this.sprite.body.immovable = false;
        this.flags.is_fly = true;
        this.sprite.body.gravity.y = 0;
        this.sprite.body.height = 81;
        this.sprite.body.position.y -= 40;
        this.sprite.body.velocity.x = this.velocities.fly_velocity*dir;
        return null;
    }

    doReflection(dir)
    {
        this.sprite.scale.setTo(dir, 1);
    }

}