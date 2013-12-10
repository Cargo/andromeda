/**
 * Andromeda
 */

var Design = {
	goToNextProject: function() {
		var route = Cargo.Helper.GetCurrentRoute();

		if (route == "feed" || route == "") {
			var nextContainer = Design.findActiveProject().next();
			if (nextContainer.length > 0) {
				$(".project_container.active").removeClass("active");
				nextContainer.addClass("active");

				var newPos = nextContainer.offset().top;
				Design.doScroll(newPos, newPos - 50, 100);
			}
		} else {
			Action.Project.Next();
		}
	},

	goToPrevProject: function() {
		var route = Cargo.Helper.GetCurrentRoute();

		if (route == "feed" || route == "") {
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
		var activeProject = $(".project_container.active"),
			windowHeight = $(window).height(),
			windowScrollTop = $(window).scrollTop(),
			windowScrollBottom = windowScrollTop + windowHeight;

		if (activeProject.length > 0) {
			var projectHeight = activeProject.height(),
				projectTop = Math.floor(activeProject.offset().top) - 51,
				projectBottom = Math.ceil(projectTop + projectHeight) + 51;

			if (windowScrollTop >= projectTop && windowScrollBottom <= projectBottom) {
				return activeProject;
			}
		}

		// Nothing returned, find closest and mark it as active
		var container_top, container_height, container_center, distToCenter,
			bestResult = 9e9,
			closestContainer = $();

		$(".project_container").each(function() {
			container_top = $(this).position().top;
			container_height = $(this).height();
			container_center = container_top + (container_height / 2);

			distToCenter = Math.abs(windowScrollTop - container_center);
			if (distToCenter < bestResult) {
				bestResult = distToCenter;
				closestContainer = $(this);
			}
		});

		return closestContainer;
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

Cargo.Event.on("freshbox_destroy_hotkeys", function() {
	Design.bindHotKeys();
});
