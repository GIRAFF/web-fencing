var menu = {
	game: function() {
		gm.dispatchEvent(new CustomEvent("menuHit", {
			action: 'game'
		}));
	},
	stats: function() {
		// TODO show stats
	},
	settings: function() {
		// TODO change settings
	},
	about: function() {
		// TODO show about
	},
	explode: function() {
	}
};
