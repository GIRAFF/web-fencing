/* TODO Script's responsibility is to generate tile list from .jsonp and to
 *      provide a tool to create locations easily. Bonus points for saving
 *      and loading progress from local storage. */

var game;

function init()
{
	initTileset();
	initPhaser();
}

function initTileset()
{
	var layout = document.getElementById('tiles');
	for (var i in tiles) {
		var div = document.createElement('div'),
			img = document.createElement('img'),
			p = document.createElement('p');

		div.classList.add('tile');
		div.id = i;
		// TODO make './tiles/' settable
		console.log('WARNING: hardcode value "./tiles/".');
		img.src = './tiles/' + i;
		p.innerHTML = '' + i + ', '
			+ tiles[i].size.w.toString() + 'x' + tiles[i].size.h.toString();

		div.appendChild(img);
		div.appendChild(p);
		layout.appendChild(div);
	}
}

function initPhaser()
{
	game = new Phaser.Game(1200, 600, Phaser.CANVAS, "phaser", {
                preload: phaserPreload,
                create: phaserCreate,
                update: phaserUpdate,
                render: phaserRender
        });
}

// TODO selection, moving, copying and more

function phaserPreload()
{
	// TODO load tiles
}

function phaserCreate()
{
}

function phaserUpdate()
{
}

function phaserRender()
{
}
