/*
TODO:
1. fix algorythm for calculating radius and threshold
2. adjust animation speed
3. replace circle with sparkles.
4. clip bounding box to visible area
5. refractor attaching svgs

*/


function SPARKLER(cont, args) {

	var self = this,
	threshold = {
		min : 200,
		max : 0
	},
	radius = {
		min : typeof args.radiusMin !== "undefined" ? args.radiusMin : 50,
		max : typeof args.radiusMax !== "undefined" ? args.radiusMax :10
	},
	maxCount = typeof args.maxCount !== "undefined" ? args.maxCount : 200,
	container = typeof cont !== "undefined" ? cont : false,
	svg,
	path,
	maxThreshold = 50,
	maxDrawRange = 100,
	increaseDrawDistance,
	maxRadius = 20,
	animSpeed = 3000,
	particles = [],
	line = typeof args.path !== "undefined" ? args.path : null,

	init = function() {
		console.log('initializing sparkler for ' + container + ' element with maxCount ' + maxCount);
		generateLine(container, line, { w : 1435, h : 500});
		generateRandomSpark();
	},

	// some getters and setters

	getThreshold = function() { return threshold; },
	setThreshold = function(t) { threshold = t; },

	getRadius = function() { return radius; },
	setRadius = function(r) { radius = r;},

	getMaxCount = function() { return maxCount; },
	setMaxCount = function(m) { maxCount = m; },

	generateLine = function(cont, svgElemId, size) {
		svg = d3.select(cont).append("svg:svg").attr("width", size.w).attr("height", size.h);

    	var l =  d3.select(cont).select(function() {
	    	return this.appendChild(document.getElementById(svgElemId));
	  	});

		self.path = svg.append("svg:path").attr("d", l.select("path").attr("d"));
		self.path.style("left", 50)
	},

	generateRandomSpark = function() {
		var x = 0;

		initGen = window.setInterval(function() {

			for (var i = 0; i < maxCount; i++) {
				if (typeof particles[i] === "undefined") {
					generateParticle(i);
				}	
			}
		}, 10);

	},

	generateParticle = function(i) {

		var id = i;

		var pathEl = self.path.node();
		var pathLength = pathEl.getTotalLength();

		var BBox = pathEl.getBBox();

		var scale = pathLength/BBox.width;
		var offsetLeft = document.getElementById("line").offsetLeft;

	    var x = Math.random() * pathLength ;

	    if (x < document.getElementById('line').offsetLeft )
	    	x = document.getElementById('line').offsetLeft;

		var beginning = x, end = pathLength, target;
		while (true) {
		  target = Math.floor((beginning + end) / 2);
		  pos = pathEl.getPointAtLength(target);

		  if ((target === end || target === beginning) && pos.x !== x) {
		      break;
		  }
		  if (pos.x > x)      end = target;
		  else if (pos.x < x) beginning = target;
		  else                break; //position found
		}

		// calculate threshold based on distance from the beginning
		var   tx1 = 0
			, ty1 = threshold.min
			, tx2 = BBox.width
			, ty2 = threshold.max
			, tx = pos.x
			, t = ((ty2-ty1)*(tx-tx1)+(tx2*ty1) - (tx1*ty1))/(tx2-tx1);

		var   rx1 = 0
			, ry1 = radius.min
			, rx2 = BBox.width
			, ry2 = radius.max
			, rx = pos.x
			, r = ((ry2-ry1)*(rx-rx1)+(rx2*ry1) - (rx1*ry1))/(rx2-rx1);

			var rad = r;
			var dur = Math.random() * animSpeed + animSpeed;
			var delay = Math.random() *  5000

		particles[id] = svg.append("circle")
			// .attr('filter','url(#i1)') // need to find a better way because this is too heavy for browsers...
			.attr("opacity", 1)
			.attr('id', "p_" +id)
			.attr("cx", x + Math.random() * t * 10 / (BBox.width - pos.x))
			.attr("cy", pos.y + Math.random() * t - t/2)
			.attr("r", 0)
			.attr("fill", "white")
			.transition()
			    .delay(delay )
			    .duration( dur )
			    .attr("r", r)
			    .style('opacity', 0)
			.each("end", function() {
				particles[id].remove();
				d3.select(container).select('#p_' + id).remove();
				if ( id < maxCount) {
					generateParticle(id);
				}
			});
	}

	return {
		init : init,
		getThreshold : getThreshold,
		setThreshold : setThreshold,

		getRadius : getRadius,
		setRadius : setRadius,

		getMaxCount : getMaxCount,
		setMaxCount : setMaxCount
	}
}

$(document).ready(function() {
	var s = new SPARKLER('#line', {
		path : "Layer_1"
	});

	s.init();

	// var count = s.getMaxCount();
	// console.log(count)

	// $('#setCount').noUiSlider({
	// 	start: [ eval(s.getMaxCount()) ],
	// 	range: {
	// 		'min': [  0 ],
	// 		'max': [ 500 ]
	// 	}
	// }).on({
	// 	slide : function() {
	// 		s.setMaxCount(Math.round($(this).val()))
	// 		$('#countCurrent').text(Math.round($(this).val()));
	// 	}
	// });

	// var r = s.getRadius();

	// console.log(r)

	// $('#setRadius').noUiSlider({
	// 	start: [ r.max, r.min  ],
	// 	range: { 'min' : [0], 'max' : [100]}

	// })
})

