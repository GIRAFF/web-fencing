class Player
{
    constructor(position, size)
    {
        this.isAlive = 1; // 0 - death, 1 - alive
        this.position.x = position.x;
        this.position.y = position.y;
        this.size.w = size.w;
        this.size.h = size.h;
        this.onGround = false;
    }

    on_ground()
    {
        console.log("ONGround");
    }

    jump(g)
    {
        if(!onGround)
        {
            position.y-=g;
        }

    }

    move(x, y)
    {
        this.position.x += x;
        this.position.y += y;
    }

    attack()
    {
        console.log("ATACK!!!!!");
    }
}