/**
 * Andromeda
 */

var Design = {
	goToNextProject: function() {
		var route = Cargo.Helper.GetCurrentRoute();
		var is_feed_view = !!($('[data-view="Feed"]').length > 0);

		if (is_feed_view || route == "Feed" || route == "") {
			var nextContainer = Design.findActiveProject().next();

			if (nextContainer.length > 0) {
				$(".project_container.active").removeClass("active");
				nextContainer.addClass("active");

				var newPos = nextContainer.offset().top;
				Design.doScroll(newPos, newPos - 50, 100);
				
				if(nextContainer.next().length <= 0 && Cargo.Helper.GetTotalPages() > Cargo.API.Config.current_page) {
					Cargo.View.Autopaginate.Data.is_updating = true;
					Cargo.View.Main.NextPage();
				}
			} 

		} else {
			Action.Project.Next();
		}
	},

	goToPrevProject: function() {
		var route = Cargo.Helper.GetCurrentRoute();
		var is_feed_view = !!($('[data-view="Feed"]').length > 0);

		if (is_feed_view || route == "Feed" || route == "") {
			var prevContainer = Design.findActiveProject().prev();
			if (prevContainer.length > 0) {
				$(".project_container.active").removeClass("active");
				prevContainer.addClass("active");

				var newPos = prevContainer.offset().top;
				Design.doScroll(newPos, newPos + 50, 100);
			}
		} else {
			Action.Project.Prev();
		}
	},

	findActiveProject: function() {
		return $(".project_container:in-viewport");
	},

	bindHotKeys: function() {
		// Shortcut navigation
		Cargo.Core.KeyboardShortcut.Remove("J");
		Cargo.Core.KeyboardShortcut.Remove("K");
		Cargo.Core.KeyboardShortcut.Remove("Left");
		Cargo.Core.KeyboardShortcut.Remove("Right");

		Cargo.Core.KeyboardShortcut.Add("Left", 37, function() {
			Design.goToPrevProject();
			return false;
		});

		Cargo.Core.KeyboardShortcut.Add("Right", 39, function() {
			Design.goToNextProject();
			return false;
		});

		Cargo.Core.KeyboardShortcut.Add("J", 74, function() {
			Design.goToNextProject();
			return false;
		});

		Cargo.Core.KeyboardShortcut.Add("K", 75, function() {
			Design.goToPrevProject();
			return false;
		});
	},

	doScroll: function(targetYPos, y, t, callback) {
		$({scrollPos: y}).animate({scrollPos: targetYPos}, {
			duration: t,
			easing: "swing",
			step: function() {
				window.scrollTo(0, this.scrollPos);
			}
		});

		return false;
	} 
}

/**
 * Events
 */

$(function() {
	// Loading animations
	Cargo.Core.ReplaceLoadingAnims.init();
	Design.bindHotKeys();
});

Cargo.Event.on("project_collection_reset", function() {
	if (Cargo.Plugins.hasOwnProperty("elementResizer")) {
		setTimeout(function() {
			Cargo.Plugins.elementResizer.refresh();
		}, 5);
	}
});

// Set options for element resizer
Cargo.Event.on("element_resizer_init", function(plugin) {
	plugin.setOptions({
		adjustElementsToWindowHeight: false,
		centerElements: false,
		allowInit: Cargo.Model.DisplayOptions.get("resize_images")
	});
});

Cargo.Event.on("fullscreen_destroy_hotkeys", function() {
	Design.bindHotKeys();
});
