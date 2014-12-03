/*
TODO:
	1. fix algorythm for calculating radius and threshold
	2. adjust animation speed
√	3. replace circle with sparkles. 
	4. clip bounding box to visible area
√	5. refractor attaching svgs

*/

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
		min : typeof args.radiusMin !== "undefined" ? args.radiusMin : 150,
		max : typeof args.radiusMax !== "undefined" ? args.radiusMax :30
	},
	maxCount = typeof args.maxCount !== "undefined" ? args.maxCount : 30,
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

		var size = Math.random() * r*.3 + r*.7;
		var sparkSize = 200;
		var destOpacity

		var scale_size = size/sparkSize*2;

		particles[id].append('circle')
			.attr('r', size)
			.style('opacity', 0)
			.attr('fill', 'red');


		var sparkles = [
			"/images/spark_1.svg",
			"/images/spark_2.svg",
			"/images/spark_3.svg"
		];


		var item = sparkles[Math.floor(Math.random()*sparkles.length)];

	  	var spark = d3.xml(item, "image/svg+xml", function(xml) {
	  	  var importedNode = document.importNode(xml.documentElement, true);
	  	  	$('#p_' + id).html($('#p_' + id).html() + importedNode.innerHTML);
	  		d3.select('#p_' + id).select('g')
	  			
	  			.attr('transform', 'translate(-'+size+', -'+size+') scale('+scale_size+') ');
	  	});


		particles[id]
			.attr('transform', 'translate('+x+','+pos.y+') scale(0) rotate(0)')
			.attr('id', "p_" +id)
			.style('opacity', 1)
			.transition()
		    .duration(dur)
		    .delay(delay)

		    .style('opacity', 0)
			.attr('transform', 'translate('+x+','+pos.y+') scale(0.5) rotate(90)')

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
})

