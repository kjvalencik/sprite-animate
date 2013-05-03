/*global jQuery*/
/*browser: true*/
/*white: true*/
(function ($, document, window) {
	"use strict";

	// Test for translate3d
	var el = document.createElement('p'),
		transforms = {
			'webkitTransform' : '-webkit-transform',
			'OTransform'      : '-o-transform',
			'msTransform'     : '-ms-transform',
			'MozTransform'    : '-moz-transform',
			'transform'       : 'transform'
		},
		has3d,
		transformType;

	$(document).ready(function () {
		var transform;
		document.body.insertBefore(el, null);
		for (transform in transforms) {
			if (transforms.hasOwnProperty(transform) && el.style[transform] !== undefined) {
				transformType = transforms[transform];
				el.style[transform] = "translate3d(1px, 1px, 1px)";

				has3d = window.getComputedStyle(el).getPropertyValue(transformType);
				has3d = (has3d !== undefined && has3d.length > 0 && has3d !== "none");

				if (has3d) {
					break;
				}
			}
		}
		document.body.removeChild(el);
	});

	function setFrame($content, config, frame) {
		var x, y;

		x = -1 * (frame % config.columns) * config.width;
		y = -1 * Math.floor(frame / config.columns) * config.height;

		if (has3d) {
			$content.css(transformType, 'translate3d(' + x + 'px, ' + y + 'px, 0)');
		} else {
			$content.css('margin', y + 'px 0 0 ' + x + 'px');
		}
	}

	$.fn.extend({
		spriteAnimate : function (options) {
			var $self = this,
				config = {
					content : '.animate-content',
					columns : 1,
					frames  : 1,
					fps	 : 24,
					loop	: false,
					reverse : false,
					height  : $self.height(),
					width   : $self.width()
				},
				// State
				animating = false,
				startTime = 0,
				frame,
				frameTickHandle,
				// Functions
				frameTick,
				animate,
				// Cached elements
				$content;

			options = $.extend(config, options);
			$content = $self.find(config.content);

			// If we are playing in reverse, initialize at the last frame
			if (config.reverse) {
				frame = config.frames - 1;
				setFrame($content, config, frame);
			}

			frameTick = function () {
				var nextFrame = Math.floor(config.fps * ((new Date()) - startTime) / 1000);

				// Mod to get frame on a loop
				if (config.loop) {
					nextFrame = nextFrame % config.frames;
				}

				// Stop if we are at the end of a single play
				if (nextFrame >= config.frames) {
					animating = false;
					clearInterval(frameTickHandle);

					if ("function" === typeof config.callback) {
						config.callback($self);
					}

					nextFrame = config.frames - 1;
				}

				// If we are running backwards, flip the frame order
				if (config.reverse) {
					nextFrame = config.frames - nextFrame - 1;
				}

				// Only render the next frame if it is different
				if (nextFrame !== frame) {
					frame = nextFrame;
					setFrame($content, config, frame);
				}
			};

			animate = function () {
				startTime = (new Date()) - startTime;
				// Set frame tick at double the frame rate
				frameTickHandle = setInterval(frameTick, 500 / config.fps);
			};

			return {
				play : function () {
					if (!animating) {
						animating = true;
						animate();
					}
					return this;
				},
				pause : function () {
					if (animating) {
						// Save elapsed time
						startTime = (new Date()) - startTime;
						// Stop animating
						animating = false;
						clearInterval(frameTickHandle);
					}
					return this;
				},
				stop : function () {
					animating = false;
					startTime = 0;
					clearInterval(frameTickHandle);
					if (config.reverse) {
						frame = config.frames - 1;
					} else {
						frame = 0;
					}
					setFrame($content, config, frame);
					return this;
				},
				rewind : function () {
					var isAnimating = animating;
					this.stop();
					if (isAnimating) {
						this.play();
					}
					return this;
				},
				reverse : function () {
					var curTime = new Date(),
						totalTime = config.frames * (1000 / config.fps),
						ellapsedTime;

					config.reverse = !config.reverse;
					frame = config.frames - frame - 1;

					if (!animating) {
						startTime = 0;
					} else {
						// Normalize ellapsed time
						ellapsedTime = (curTime - startTime) % totalTime;
						// Recalculate start time
						startTime = curTime - totalTime + ellapsedTime;
					}
					return this;
				}
			};
		}
	});

}(jQuery, document, window));
