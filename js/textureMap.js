class Map
{
    constructor(group, game)
    {
        //this.platform_list = [];
        this.group = group;
        this.g = game;
    }   

    addPlatform(position, size, texture)
    {
        let a = this.group.create(position.x, this.g.world.height - position.y);
        a.width = size.w;
        a.height = size.h;
        a.body.immovable = true;

		let texture_ground = this.g.add.tileSprite(
            position.x, this.g.world.height - position.y, size.w, size.h, texture);
    }
}