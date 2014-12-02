/*
TODO:
1. fix algorythm for calculating radius and threshold
2. adjust animation speed
3. replace circle with sparkles.
4. clip bounding box to visible area
*/


function SPARKLER(cont, args) {

	var self = this,
	threshold = {
		min : 100,
		max : 0
	},
	radius = {
		min : 50,
		max : 10
	},
	currentCount = 0,
	maxCount = typeof args.maxCount !== "undefined" ? args.maxCount : 100,
	container = typeof cont !== "undefined" ? cont : false,
	svg,
	path,
	maxThreshold = 50,
	maxDrawRange = 100,
	increaseDrawDistance,
	maxRadius = 20,
	animSpeed = 2000,
	particles = [],
	line = typeof args.path !== "undefined" ? args.path : null,



	init = function() {
		console.log('initializing sparkler for ' + container + ' element with maxCount ' + maxCount);
		generateLine();
		generateRandomSpark();
		randomize();
	},

	setmaxThreshold = function(t) {
		maxThreshold = t;
	},

	setAnimSpeed = function(s) {
		animSpeed = s;
	},
	getAnimSpeed = function() {
		return animSpeed;
	},

	getMaxRadius = function() {
		return maxRadius;
	},
	setMaxRadius = function(r) {
		maxRadius = r;
	},

	generateLine = function() {
		svg = d3.select(container).append("svg:svg").attr("width", "1435px").attr("height", "500");

    	var l =  d3.select(container).select(function() {
	    	return this.appendChild(document.getElementById(line));
	  	});

	  	console.log(l.select("path").attr("d"));

		self.path = svg.append("svg:path").attr("d", l.select("path").attr("d"));
		self.path.style("left", 50)
	},

	generateRandomSpark = function() {
		var x = 0;

		initGen = window.setInterval(function() {
			if (typeof particles[x] === "undefined") {
				generateParticle(x);
				x++;
			}

			if ( x === maxCount) {
				window.clearInterval(initGen);
			}
		}, 10)

	},

	generateParticle = function(i) {

		var id = i;

		var pathEl = self.path.node();
		var pathLength = pathEl.getTotalLength();

		var BBox = pathEl.getBBox();

		var scale = pathLength/BBox.width;
		var offsetLeft = document.getElementById("line").offsetLeft;

	    var x = Math.random() * pathLength;

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
			, ty2 = threshold.min
			, tx = pos.x
			, t = ((ty2-ty1)*(tx-tx1)+(tx2*ty1) - (tx1*ty1))/(tx2-tx1);

		// calculate radius based on distance from the beginning

		var   rx1 = 0
			, ry1 = radius.min
			, rx2 = BBox.width
			, ry2 = radius.max
			, rx = pos.x
			, r = ((ry2-ry1)*(rx-rx1)+(rx2*ry1) - (rx1*ry1))/(rx2-rx1);

			var rad = r;


		particles[id] = svg.append("circle")
			// .attr('filter','url(#i1)') // need to find a better way because this is too heavy for browsers...
			.attr("opacity", 1)
			.attr('id', "p_" +id)
			.attr("cx", x + Math.random() * t - t/2 + 100)
			.attr("cy", pos.y + Math.random() * t - t/2 - 50)
			.attr("r", 0)
			.attr("fill", "white")
			.transition()
			    .delay(function(d,i) { return Math.random() *  1000; })
			    .duration(Math.random() * animSpeed + animSpeed )
			    .attr("r", r)
			    .style('opacity', 0)
			.each("end", function() {
				particles[id].remove();
				d3.select(container).select('#p_' + id).remove();
				generateParticle(id);
			});


	},

	randomize = function() {
    var randomizeButton = d3.select("button");


	randomizeButton.on("click", function(){
      var data = d3.range(50).map(function(){return Math.random()*10});
      self.path
        .transition()
        .duration(300)
        .attr("d", line(data));
    });

	},

	setMaxCount = function(n) {
		maxCount = n;
	},
	getMaxCount = function() {
		return maxCount;
	}


	return {
		init : init,
		setMaxCount : setMaxCount,
		getMaxCount : getMaxCount,
		setmaxThreshold : setmaxThreshold,
		setAnimSpeed : setAnimSpeed,
		getAnimSpeed :getAnimSpeed,
		setMaxRadius : setMaxRadius
	}
}

$(document).ready(function() {
	var s = new SPARKLER('#line', {
		path : "Layer_1"
	});

	s.init();

	$('#maxThreshold').mousemove( function() {
	    var newValue = $(this).val();
	    $('#maxThreshold_label').html(newValue);
	    s.setmaxThreshold(newValue);
	});

	$('#anim_speed').mousemove( function() {
	    var newValue = parseInt($(this).val(), 10);
	    $('#anim_speed_label').html(newValue);
	    s.setAnimSpeed(newValue);
	});

	$('#max_radius').mousemove( function() {
	    var newValue = parseInt($(this).val(), 10);
	    $('#max_radius_label').html(newValue);
	    s.setMaxRadius(newValue);
	});
})


// parallax animation




function paralax (el, start, duration, initialStyle, destStyle ) {
	// taking care of transform prefixes...
	if (initialStyle['transform'] != undefined) {
		var   is = initialStyle['transform']
			, ds = destStyle['transform'];

		initialStyle['-moz-transform'] = is;
		initialStyle['-webkit-transform'] = is;
		initialStyle['-o-transform'] = is;
		initialStyle['transform'] = is;

		destStyle['-moz-transform'] = ds;
		destStyle['-webkit-transform'] = ds;
		destStyle['-o-transform'] = ds;
		destStyle['transform'] = ds;
	}

	if (start+duration < window.pageYOffset && start > window.pageYOffset) {
		if ( destStyle['position'] != undefined) {
			destStyle['position'] = initialStyle['position'];
		}
		return destStyle
	}

	if (start > window.pageYOffset) {
		return initialStyle
	}

	var currentStyle = {};

	for ( var i in destStyle ) {

	 	switch( i ) {

		case 'color': 
		case 'background-color':
		case 'border-color':

			var   color = colorToTable(initialStyle[i])
				, finalColor = colorToTable(destStyle[i])
				, currentColor = [];

			for ( var c = 0; c < color.length; c++ ) {

				var   x1 = floatval(start)
					, x2 = floatval(start + duration)
					, y1 = color[c]
					, y2 = finalColor[c]
					, x = $(window).scrollTop()
					, pos = ((y2-y1)*(x-x1)+(x2*y1) - (x1*y1))/(x2-x1)
					, minPos = 0
					, maxPos = x2 - x1
					, currentPos = parseInt(($(window).scrollTop()-x1) * 100 / maxPos) / 100

				currentColor.push( Math.ceil(finalColor[c] * currentPos + color[c] * (1-currentPos)) );
				currentStyle[i] =  'rgb(' + currentColor[0] + ', ' + currentColor[1] + ', ' + currentColor[2] + ')';
			}

		  	break;

		case 'transform' :
		case '-o-transform':
		case '-moz-transform' :
		case '-webkit-transform' :

			var   x1 = floatval( start )
				, y1 = floatval( String(initialStyle[i]).replace('rotate(', '').replace('deg)', '') )
				, x2 = floatval( start+duration )
				, y2 = floatval( String(destStyle[i]).replace('rotate(', '').replace('deg)', '') )
				, x = window.pageYOffset
				, y = ((y2-y1)*(x-x1)+(x2*y1) - (x1*y1))/(x2-x1)

			currentStyle['transform'] = 'rotate(' + y + 'deg)';
			currentStyle['-o-transform'] = 'rotate(' + y + 'deg)';
			currentStyle['-moz-transform'] = 'rotate(' + y + 'deg)';
			currentStyle['-webkit-transform'] = 'rotate(' + y + 'deg)';

			break;
		
		case 'display' :
		case 'position' :
			currentStyle[i] = destStyle[i];

			break;

		default: 
			var   x1 = floatval(start)
				, y1 = floatval(initialStyle[i])
				, x2 = floatval(start+duration)
				, y2 = floatval(destStyle[i])
				, x = window.pageYOffset
				, y = ((y2-y1)*(x-x1)+(x2*y1) - (x1*y1))/(x2-x1)
		
			currentStyle[i] = Math.floor(y);

			break;
		}
	}

	return currentStyle
}

function floatval ( mixed_var ) { return (parseFloat(mixed_var) || 0) }


function isElementInViewport(el) {
	return true;

}


$(window).load(function () {

   
    var scroll;
    scroll = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60)
    }

    lastPosition = -1, 
    wHeight = window.innerHeight, 
    wWidth = window.innerWidth,
    elements = [
        document.getElementById("globe_small")
      , document.getElementById("globe_medium")
      , document.getElementById("globe_large")
      , document.getElementById("campain-overlay__header")
      , document.getElementById("movie_titles")
        //document.getElementById("globe_medium")
    ],
//   margin-left: 74px;
  // margin-top: -114px;
    anims = [
        [elements[0], 0, wHeight, {'top' : 326 }, {'top' : 450 }]
       ,[elements[1], 0, wHeight*1.5, {marginTop : -114}, {marginTop: 400}]
       ,[elements[2], 0, wHeight, {top : 46}, {top : 46+wHeight/10}]
       ,[elements[3], 0, wHeight, {top : -200}, {top : -46}]
       ,[elements[4], 0, wHeight, {top : 400}, {top : 400 + wHeight/12}]
    ], 
    height = [];

    function loop() {
        
        if (lastPosition == window.pageYOffset) {
            scroll(loop)
            return false
        } else lastPosition = window.pageYOffset


        var i = 0;

        for (i = 0; i < elements.length; i++) {
            if (elements[i] == 0)
                continue;
            var offset;
            var page = $(elements[i]).closest('.page');
            var pjs = document.getElementById(page.prop('id'));
            var position = document.defaultView.getComputedStyle(elements[i], null).getPropertyValue('position');
            if (position == 'fixed') {
                offset = parseInt($(elements[i].parentNode).offset().top);
                height[i] = parseInt($(elements[i].parentNode).outerHeight());
            } else {
                offset = parseInt($(elements[i]).offset().top);
            }
            if (isElementInViewport(pjs)) {
                var obj = $(elements[i]),
                    u = anims.filter(function (element) {
                        return element[0] == elements[i]
                    }),
                    cs = {}, s = {}, so = {}
                for (var a = 0; a < u.length; a++) {
                    if ((u[a][1] <= window.pageYOffset) && (window.pageYOffset < u[a][1] + u[a][2])) {
                        s = paralax(u[a][0], u[a][1], u[a][2], u[a][3], u[a][4]);
                        for (var b in s) {
                            cs[b] = s[b];
                        }
                    } else if ((u[a][1] > window.pageYOffset)) {
                        s = u[a][3]
                        so = (a == 0) ? s : u[a - 1][4];
                        for (var b in s) {
                            if (a == 0) {
                                cs[b] = s[b]
                            } else {
                                if (so[b] == undefined)
                                    cs[b] = s[b]
                            }
                        }
                    } else if ((window.pageYOffset >= u[a][1] + u[a][2])) {
                        s = u[a][4], so = (a < u.length - 1) ? u[a + 1][3] : s;
                        for (var b in s) {
                            if (a == u.length - 1) {
                                cs[b] = s[b];
                            } else {
                                cs[b] = s[b]
                            }
                        }
                    }
                }
                obj.css(cs)
            } else {}
        }
        scroll(loop)
    }
    loop()
});
