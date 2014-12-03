/*
TODO:
1. fix algorythm for calculating radius and threshold
2. adjust animation speed
3. replace circle with sparkles.
4. clip bounding box to visible area
5. refractor attaching svgs

*/

function angleTween(d, i) {
	var angle = 360 - ((i+1)*20);
	var i = d3.interpolate(0, angle);
	return function(t) {
		return "rotate(" + i(t) + ")";
	};
}

centerToOrigin = function(el) {
var boundingBox;
boundingBox = el.getBBox();
	return {
		x: -1 * Math.floor(boundingBox.width / 2),
		y: -1 * Math.floor(boundingBox.height / 2)
	};
};

function SPARKLER(cont, args) {

	var self = this,
	threshold = {
		min : 0,
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
			else break; //position found
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

		var symbol = d3.svg.symbol().type('rect');

			var cx = pos.x,
				cy = pos.y;

		var p = particles[id];

		particles[id] = svg.append('g');

		particles[id].append('circle')
			.attr('r', 20)
			.style('opacity', 0)

		particles[id].append('rect')
			.attr('width', 26)
			.attr('height', 26)
			.style('fill', 'white')
			.attr('transform', 'translate(-13, -13)')

		particles[id]
			.attr('transform', 'translate('+x+','+pos.y+') scale(0) rotate(0)')
			.attr('id', "p_" +id)
			.style('opacity', 1)
			.transition()
		    .duration(dur)
		    .delay(delay)

		    .style('opacity', 0)
			.attr('transform', 'translate('+x+','+pos.y+') scale(1) rotate(90)')

		    .each("end", function() {
		    	particles[id].remove();
		    	d3.select(container).select('#p_' + id).remove();
		    	if ( id < maxCount) {
		    		generateParticle(id);
		    	}
		    });	

		// particles[id] = svg.append('g')
		// 	.attr('class', 'rotate')
  // 			// .attr('x', x-10)
  // 			// .attr('y', pos.y-10)
  // 			// .attr('x2', x + r)
  // 			// .attr('y2', pos.y + r)
  // 			// .attr('d', d3.svg.symbol().type('rect'))
  // 			.attr('width', 20)
  // 			.attr('height', 20)
		// 	.attr("fill", "black")
		// 	.attr('id', "p_" +id)
		// 	.attr("transform", "translate(" + (Math.round(x-10)) + "," + ( Math.round(pos.y-10)) + ")")
		// 	// .attr('transform', 'rotate(5, '+x+', '+pos.y+')')
		// 	.attr("transform", "rotate(0) ");
			
		// particles[id].append('rect')
		// 	// .attr('x', x-10)
		// 	// .attr('y', pos.y-10)
  // 			.attr('width', 20)
  // 			.attr('height', 20)
		// 	.attr("fill", "black")
		// 	.attr('id', "p_" +id)
		// 	.attr('r', r)
			
		// particles[id]
		// .style('opacity', 1)
		// .attr("transform", "rotate(0) ")
		// .transition()
		//     .delay(delay )
		//     .duration( dur )
		//     .style('opacity', 0)
		//     .attr('fill', 'white')
		//     .attr("transform", "rotate(40) ")

		// .each("end", function() {
		// 	particles[id].remove();
		// 	d3.select(container).select('#p_' + id).remove();
		// 	if ( id < maxCount) {
		// 		generateParticle(id);
		// 	}
		// 	});			


		// var center = centerToOrigin(particles[id].node());

		// particles[id]
			

			// .attr('transform', 'rotate(45, '+x+', '+pos.y+')')
			// .ease('cubic')
			//.attrTween("transform", angleTween);

			// spark.attr('fill', 'black');

			// .style('opacity', 0)
			// .attr('transform', 'rotate(90,'++' ,'++' )')
			// .attr("transform", "matrix(10, 0, 0, 10, "+(cx-10*cx)+", "+(cy-10*cy)+")")

			// .attr('transform', function() {
			// 	return 'rotate(54, '+(x - 20)+', '+(pos.y - 100)+')';
			// })
		

		// particles[id] = svg.append("circle")
		// 	// .attr('filter','url(#i1)') // need to find a better way because this is too heavy for browsers...
		// 	.attr("opacity", 1)
		// 	.attr('id', "p_" +id)
		// 	.attr("cx", x + Math.random() * t * 10 / (BBox.width - pos.x))
		// 	.attr("cy", pos.y + Math.random() * t - t/2)
		// 	.attr("r", 0)
		// 	.attr("fill", "white")
		// 	.transition()
		// 	    .delay(delay )
		// 	    .duration( dur )
		// 	    .attr("r", r)
		// 	    .style('opacity', 0)
		// 	.each("end", function() {
		// 		particles[id].remove();
		// 		d3.select(container).select('#p_' + id).remove();
		// 		if ( id < maxCount) {
		// 			generateParticle(id);
		// 		}
		// 	});
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

