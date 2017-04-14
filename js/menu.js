var menu = {
	game: function() {
		/* firing the event for game manager to deal with */
		document.dispatchEvent(new CustomEvent("menuHit", {
			detail: {
				action: "game"
			}
		}));
	},
	stats: function() {
		// TODO request stats
		/*var stats = document.getElementById('stats'),
			menu = document.getElementById('menu');
		stats.innerHTML = "WIP";
		menu.classList.add("hidden");
		stats.classList.remove("hidden");*/
	},
	settings: function() {
		// TODO change settings
	},
	about: function() {
		// TODO show about
	}
};
