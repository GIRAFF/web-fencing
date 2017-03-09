/* weapon.js */
function createWeapon( game_group, texture_name, gravity)
{
    var new_weapon  = game_group.create(0, -100, texture_name);
    
        new_weapon.rectangle = new Phaser.Rectangle(new_weapon.position.x,
                new_weapon.position.y, new_weapon.width, new_weapon.height);

        new_weapon.on_ground = false;
        new_weapon.is_used = false;
        new_weapon.updateRect = function()
        {
            this.rectangle.x = this.position.x;
            this.rectangle.y = this.position.y;
            this.rectangle.width =  Math.abs(this.width);
            this.rectangle.height = Math.abs(this.height);

            if(this.on_ground && !this.is_used) {
                this.body.enable = false;
            }

            if(this.is_used) {
                 this.body.enable = true;
            }
        };
        new_weapon.body.gravity.y = gravity;
        new_weapon.body.collideWorldBounds = true;
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
