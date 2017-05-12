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
		showLayout("stats");
	},
	settings: function() {
		// TODO change settings
	},
	about: function() {
		// TODO show about
	}
};

function showLayout(name)
{
	var layouts = document.getElementsByClassName("over");
	for (var l = 0; l < layouts.length; ++l) {
		if (layouts[l].id === name) {
			if (layouts[l].classList.contains("hidden")) {
				layouts[l].classList.remove("hidden");
			}
		} else {
			if (!layouts[l].classList.contains("hidden")) {
				layouts[l].classList.add("hidden");
			}
		}
	}
}
