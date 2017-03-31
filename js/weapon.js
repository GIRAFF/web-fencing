/* weapon.js */
function createWeapon( game_group, texture_name, gravity, position)
{
    var new_weapon  = game_group.create(position.x, position.y, texture_name);
    
        new_weapon.on_ground = false;
        new_weapon.is_used = false;
        new_weapon.is_fly = false;
        new_weapon.body.width = new_weapon.body.width/2;
        new_weapon.line_debug = new Phaser.Line(0,0,0,0);
	    new_weapon.collideWorldBounds = true;
        new_weapon.touch_fly = false;
        new_weapon.original_size = {w: new_weapon.body.width,
                                    h: new_weapon.body.height};

        new_weapon.updateRect = function()
        {
            
            if(this.on_ground) {
                this.body.enable = false;
                this.touch_fly = false;
                this.is_fly = false;
                this.alpha = 1;
            }
            else
            if(this.is_used) {
                 this.touch_fly = false;
                 this.body.enable = true;
                 this.is_fly;
            }
            else
            if(this.is_fly) 
                this.body.enable = true;

            if(this.touch_fly) {
                this.body.velocity.x = 0;
                this.body.gravity.y = 1000;
            }
            
              this.line_debug.setTo(this.body.position.x,
						this.body.position.y,
						this.body.position.x +
						this.body.width,
						this.body.position.y +
						this.body.height);
        };

        new_weapon.fly = function(dir)
        {
            var x = this.body.position.x;
            this.body.velocity.x = 300*dir;
            this.body.gravity.y = 0;
            this.is_fly = true;
        }


        new_weapon.body.gravity.y = gravity;
       // new_weapon.body.collideWorldBounds = true;
        new_weapon.doReflection = function( dirrection )
        {
            var dir;
            if(dirrection > 0)
                dir = 1;
            else
                dir = -1;

            this.scale.setTo(dir, 1);
        }
    
}
