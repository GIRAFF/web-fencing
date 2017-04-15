class Map
{
    constructor(group, game)
    {
        this.group = group;
        this.g = game;
        this.width = 5000;
        this.height = game.world.height;
    }   

    addPlatform(p)
    {
        let a = this.group.create(p.x, this.g.world.height - p.y);
        a.width = p.w;
        a.height = p.h;
        a.body.immovable = true;

		let texture_ground = this.g.add.tileSprite(
            p.x, this.g.world.height - p.y, p.w, p.h, p.t);
    }

    InitFromList(list)
    {
        for(var i = 0; i < list.length; i++)
        {
            this.addPlatform(list[i]);
        }
    }
}