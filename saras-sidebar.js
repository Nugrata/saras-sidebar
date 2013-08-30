/*
 *  Saras sidebar toggle - v1.0
 *
 *  Made by Tirta Nugraha
 *  This plugin is the part of saras admin template
 *  plugin licensed under MIT License
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function($, window, document, undefined) {

	"use strict";

	// undefined is used here as the undefined global variable in ECMAScript 3 is
	// mutable (ie. it can be changed by someone else). undefined isn't really being
	// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
	// can no longer be modified.

	// window and document are passed through as local variable rather than global
	// as this (slightly) quickens the resolution process and can be more efficiently
	// minified (especially when both are regularly referenced in your plugin).

	// Create the defaults once and the objects
	var pluginName = "sa_sidebar",
		defaults = {
			open: false,
			overlay: true,
			hoverEffect: false
		},
		body_content = $("#sa_body"),
		sa_variables = {
			_self: null,
			overlay: null,
			gap: body_content.find(".sa_leftpanel").width(),
			left_panel: body_content.find(".sa_leftpanel"),
			right_panel: body_content.find(".sa_rightpanel, .sa_topnav")
		};

	// The actual plugin constructor

	function Plugin(element, options) {
		this.element = element;
		// jQuery has an extend method which merges the contents of two or
		// more objects, storing the result in the first object. The first object
		// is generally empty as we don't want to alter the default options for
		// future instances of the plugin
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;

		this.init(this.settings);
	}

	Plugin.prototype = {
		init: function(_setting) {
			// you can add more functions like the one below and
			// call them like so: this.open_sidebar(this.element, this.settings).
			if (_setting.overlay === true) {
				//adding html (overlay) element to page
				sa_variables.right_panel.prepend("<div class=\"dim\"></div>");
				sa_variables.overlay = $("#sa_rightpanel").find(".dim");
			}

			sa_variables.overlay.on('click', function(event) {
				//close sidebar when overlay is clicked
				event.preventDefault();
				Plugin.prototype.close_sidebar(_setting);
			});

			if (_setting.open === false) {
				this.close_sidebar(_setting);
			} else {
				this.open_sidebar();
			}

			if (_setting.hoverEffect === true) {
				Plugin.prototype.hoverState();
			}

			//plugin element click function
			sa_variables._self.on('click', function(event) {
				event.preventDefault();
				if (sa_variables.left_panel.hasClass("sa_sidebarClosed") === true) {
					Plugin.prototype.open_sidebar();
				} else {
					Plugin.prototype.close_sidebar(_setting);
				}
			});

		},
		open_sidebar: function() {
			//prevent hover effect by unbinding.
			sa_variables._self.unbind('mouseleave mouseenter');
			//show overlay.
			sa_variables.overlay.css("display", "block");

			//slide left & right panel
			sa_variables.left_panel
				.removeAttr('style')
				.css('left', 0)
				.removeClass("sa_sidebarClosed");

			sa_variables.right_panel.css('left', sa_variables.gap);
		},
		close_sidebar: function(_setting) {
			sa_variables.left_panel.css('left', -sa_variables.gap)
				.addClass("sa_sidebarClosed");
			sa_variables.right_panel.css('left', 0);
			//remove rightpanel overlay
			sa_variables.overlay.css("display", "none");

			//restore hover effect. check user setting first
			if (_setting.hoverEffect === true) {
				//bind hover (mouseenter & mouseleave)
				Plugin.prototype.hoverState();
			}
		},
		hoverState: function() {
			sa_variables._self.on('mouseleave', function(){
				sa_variables.left_panel.css({
					'left': -sa_variables.gap,
					'z-index': 2
				});

				sa_variables.right_panel.css('left', 0);
			});

			sa_variables._self.on('mouseenter', function() {
				var peek = 15;
				//slide right panel position a bit
				sa_variables.right_panel.css('left', peek);

				//slide left panel position a bit
				sa_variables.left_panel.css({
					'left': -sa_variables.gap + peek,
					'z-index': 2
				});
			});
		}
	};

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function(options) {
		sa_variables._self = this;
		return this.each(function() {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options));
			}
		});
	};

})(jQuery, window, document);
