jQuery Sprite Animate
---------------------

Simple jQuery Sprite Animation tool. Generally used for a image sprite
of video frames but can also be used with HTML elements. The "viewer"
should have height / width for the size of a single frame and overflow
hidden.

Usage
-----

	var controls = $('.viewer').spriteAnimate({
		content : '.animate-content',
		columns : 6,
		frames  : 60
	});

	controls.play();
