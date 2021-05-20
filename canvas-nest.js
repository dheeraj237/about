! function() {
	// Encapsulation method, reduce file size after compression
	function get_attribute(node, attr, default_value) {
		return node.getAttribute(attr) || default_value;
	}
	// Encapsulation method, reduce file size after compression
	function get_by_tagname(name) {
		return document.getElementsByTagName(name);
	}
	// Get configuration parameters
	function get_config_option() {
		var scripts = get_by_tagname("script"),
			script_len = scripts.length,
			script = scripts[script_len - 1]; // Currently loaded script
		return {
			l: script_len, // Length, used to generate id
			z: get_attribute(script, "zIndex", -1), //z-index
			o: get_attribute(script, "opacity", 0.5), //opacity
			c: get_attribute(script, "color", "0,0,0"), //color
			n: get_attribute(script, "count", 99) //count
		};
	}
	// Set the height and width of the canvas
	function set_canvas_size() {
		canvas_width = the_canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth, 
		canvas_height = the_canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	}

	// Drawing process
	function draw_canvas() {
		context.clearRect(0, 0, canvas_width, canvas_height);
		// Associated array of random lines and current position
		var e, i, d, x_dist, y_dist, dist; // Temporary node
		// Iterate through each point
		random_lines.forEach(function(r, idx) {
			r.x += r.xa, 
			r.y += r.ya, //移动
			r.xa *= r.x > canvas_width || r.x < 0 ? -1 : 1, 
			r.ya *= r.y > canvas_height || r.y < 0 ? -1 : 1, // Bounce back when hitting the boundary
			context.fillRect(r.x - 0.5, r.y - 0.5, 1, 1); // Draw a point with a width and height of 1
			// Start from the next point
			for (i = idx + 1; i < all_array.length; i++) {
				e = all_array[i];
				// Not the current point
				if (null !== e.x && null !== e.y) {
						x_dist = r.x - e.x, // x-axis distance l
						y_dist = r.y - e.y, // y-axis distance n
						dist = x_dist * x_dist + y_dist * y_dist; // Total distance, m
					dist < e.max && (e === current_point && dist >= e.max / 2 && (r.x -= 0.03 * x_dist, r.y -= 0.03 * y_dist), // Accelerate when approaching
						d = (e.max - dist) / e.max, 
						context.beginPath(), 
						context.lineWidth = d / 2, 
						context.strokeStyle = "rgba(" + config.c + "," + (d + 0.2) + ")", 
						context.moveTo(r.x, r.y), 
						context.lineTo(e.x, e.y), 
						context.stroke());
				}
			}
		}), frame_func(draw_canvas);
	}
	// Create a canvas and add it to the body
	var the_canvas = document.createElement("canvas"), // canvas
		config = get_config_option(), // Configuration
		canvas_id = "c_n" + config.l, //canvas id
		context = the_canvas.getContext("2d"), canvas_width, canvas_height, 
		frame_func = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(func) {
			window.setTimeout(func, 1000 / 45);
		}, random = Math.random, 
		current_point = {
			x: null, // Current mouse x
			y: null, // Current mouse y
			max: 20000
		},
		all_array;
	the_canvas.id = canvas_id;
	the_canvas.style.cssText = "position:fixed;top:0;left:0;z-index:" + config.z + ";opacity:" + config.o;
	get_by_tagname("body")[0].appendChild(the_canvas);
	// Initialize canvas size

	set_canvas_size(), window.onresize = set_canvas_size;
	// The mouse position is stored at that time, and the current position information is released when leaving
	window.onmousemove = function(e) {
		e = e || window.event, current_point.x = e.clientX, current_point.y = e.clientY;
	}, window.onmouseout = function() {
		current_point.x = null, current_point.y = null;
	};
	// Randomly generate config.n line position information
	for (var random_lines = [], i = 0; config.n > i; i++) {
		var x = random() * canvas_width, // Random location
			y = random() * canvas_height,
			xa = 2 * random() - 1, // Random movement direction
			ya = 2 * random() - 1;
		random_lines.push({
			x: x,
			y: y,
			xa: xa,
			ya: ya,
			max: 6000 // Attachment distance
		});
	}
	all_array = random_lines.concat([current_point]);
	// Draw after 0.1 second
	setTimeout(function() {
		draw_canvas();
	}, 100);
}();
