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

Notes
-----

I use this for cinemagraphs with transparent backgrounds. It also works well for
video thumbnails that animate on hover.

- ffmpeg works great for pulling frames from a video as images
- ImageMagick is a helpful tool for batch image processing
- Use imagemagick's montage to put the images back together as a sprite
- Pngcrush can help reduce the size of large pngs
