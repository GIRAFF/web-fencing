/* weapon.js */
function createWeapon( game_group, texture_name, gravity, position)
{
    var new_weapon  = game_group.create(position.x, position.y, texture_name);
    
        new_weapon.on_ground = false;
        new_weapon.is_used = false;
        new_weapon.is_fly = false;
        new_weapon.is_fly_touching = false;
        new_weapon.body.width = new_weapon.body.width/2;


        new_weapon.updateRect = function()
        {
            if((this.on_ground && !this.is_used && !this.is_fly)) {
                this.body.enable = false;
                this.is_fly = false;
            }

            if(this.is_used) {
                 this.body.enable = true;
            }

            if(this.is_fly) {
                this.body.enable = true;

            }

            console.log("G =" + this.body.gravity.y);
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
