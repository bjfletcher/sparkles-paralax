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
		min : typeof args.thresholdMin !== "undefined" ? args.thresholdMin : 200,
		max : typeof args.thresholdMax !== "undefined" ? args.thresholdMax : 50
	},
	radius = {
		min : typeof args.radiusMin !== "undefined" ? args.radiusMin : 100,
		max : typeof args.radiusMax !== "undefined" ? args.radiusMax :30
	},
	opacity = {
		min : typeof args.opacityMin !== "undefined" ? args.opacityMin : 0,
		max : typeof args.opacityMin !== "undefined" ? args.opacityMax : 1
	},
	maxCount = typeof args.maxCount !== "undefined" ? args.maxCount : 20,
	container = typeof cont !== "undefined" ? cont : false,
	svg,
	path,
	maxThreshold = 50,
	maxDrawRange = 100,
	increaseDrawDistance,
	maxRadius = 20,
	animSpeed = 6000,
	particles = [],
	line = typeof args.path !== "undefined" ? args.path : null,

	init = function() {
		console.log('initializing sparkler for ' + container + ' element with maxCount ' + maxCount);
		generateLine(container, line, { w : $(cont).width(), h : $(cont).height()});
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

		console.log(svg)
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

		var beginning = x, end = pathLength - 100, target;
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
		var   tx1 =  0
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


		var ox1 = 0
		  , oy1 = opacity.min
		  , ox2 = BBox.width
		  , oy2 = opacity.max * 10
		  , ox = pos.x
		  , o = ((oy2-oy1)*(ox-ox1)+(ox2*oy1) - (ox1*oy1))/(ox2-ox1);
		  o *= 2;
		  if ( o >= 0.9 ) o = 0.9;

		pos.x += Math.random() *t - t/2;
		pos.y += Math.random() *t - t/2;

			var dur = Math.random() * animSpeed + animSpeed/2;
			var delay = 0; //Math.random() *  dur;

		var symbol = d3.svg.symbol().type('rect');

		particles[id] = svg.append('g');

		var size = Math.random() * r*.3 + r*.7;
		var sparkSize = 200;
		var destOpacity

		var scale_size = size/sparkSize*2;

		particles[id].append('circle')
			.attr('r', size)
			.style('opacity', 0)
			.attr('fill', 'red');

		// pick and load random sparkle
		var sparkles = [
			"/images/spark_1_2.svg",
			"/images/spark_2_2.svg",
			"/images/spark_3_2.svg"
		];

		var item = sparkles[Math.floor(Math.random()*sparkles.length)];

	  	var spark = d3.xml(item, "image/svg+xml", function(xml) {
	  	  var importedNode = document.importNode(xml.documentElement, true);
	  	  	$(cont +  "_p_" +id).html($(cont +  "_p_" +id).html() + importedNode.innerHTML);

	  		d3.select(cont +  '_p_' + id).select('g')
	  		  .attr('transform', 'translate(-'+size+', -'+size+') scale('+scale_size+') ');
	  	});

	  	// reposition sparkle and animate
		particles[id]
			.attr('transform', 'translate('+x+','+pos.y+') scale(0) rotate(0)')
			.attr('id', cont.slice(1) +  "_p_" +id)
			.style('opacity', o)
			.transition()
		    .duration(dur)
		    .delay(delay)

		    .style('opacity', 0)
			.attr('transform', 'translate('+x+','+pos.y+') scale(0.5) rotate(90)')

			// remove sparkle, when animation done
		    .each("end", function() {
		    	particles[id].remove();
		    	d3.select(container).select(cont + '_p_' + id).remove();
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
	var s1 = new SPARKLER('#line', {
		path : "Layer_1", 
		radiusMin : 100,
		radiusMax : 30,
		opacityMin : 0.5,
		opacityMax : 2,
		maxCount : 100
	});

	var s2 = new SPARKLER("#line2", {
		path: "Layer_2",
		radiusMin : 50,
		radiusMax : 70,
		opacityMin : 20,
		opacityMax : 20,
		thresholdMin : 20,
		thresholdMax : 100,
		maxCount : 50
	});

	var s3 = new SPARKLER('#line3', {
		path : "Layer_3", 
		radiusMin : 150,
		radiusMax : 20,
		opacityMin : 0.5,
		opacityMax : 2,
		thresholdMin : 50,
		thresholdMax : 20,
		maxCount : 100
	});

	s1.init();
	s2.init();
	s3.init();
})

