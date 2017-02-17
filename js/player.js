class Player
{
    constructor(position, size)
    {
        this.isAlive = 1; // 0 - death, 1 - alive
        this.position.x = position.x;
        this.position.y = position.y;
        this.size.w = size.w;
        this.size.h = size.h;
    }

    jump()
    {

    }

    move(x, y)
    {
        this.position.x += x;
        this.position.y += y;
    }

    attack()
    {

    }
}