function SPARKLER(cont, args) {

	var self = this,
	currentCount = 0,
	maxCount = typeof args.maxCount !== "undefined" ? args.maxCount : 10,
	container = typeof cont !== "undefined" ? cont : false,
	svg,
	path,
	threshold = 50,
	maxDrawRange = 100,
	increaseDrawDistance,
	maxRadius = 20,
	animSpeed = 2000,

	init = function() {
		console.log('initializing sparkler for ' + container + ' element with maxCount ' + maxCount);
		generateLine();
		generateRandomSpark();
		randomize();
	},

	setThreshold = function(t) {
		threshold = t;
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


		svg = d3.select(container).append("svg:svg").attr("width", "1335px").attr("height", "500");
		// var data = d3.range(20).map(function(){return Math.random()*2})
		// var x = d3.scale.linear().domain([0, 10]).range([0, 700]);
		// var y = d3.scale.linear().domain([0, 10]).range([10, 200]);
		// var line = d3.svg.line()
		// 	.interpolate("cardinal")
		// 	.x(function(d,i) {return x(i);})
		// 	.y(function(d) {return y(d*5 + 5);})

		// self.path = svg.append("svg:path").attr("d", line(data));


    	var l =  d3.select(container).select(function() {
	    	return this.appendChild(document.getElementById("Layer_1"));
	  	});

	  	// console.log(self.path.attr("d"));
	  	console.log(l.select("path").attr("d"));

		self.path = svg.append("svg:path").attr("d", l.select("path").attr("d"));


	  	// self.path = l.select("path");



		// increaseDrawDistance = window.setInterval(function() {
		// 	maxDrawRange += 20;
		// 	if (maxDrawRange >= $(container).width() * 10) {
		// 		maxDrawRange= $(container).width();
		// 		window.clearInterval(window.increaseDrawDistance);
		// 	}
		// }, 50);
	},

	generateRandomSpark = function() {

		   var pathEl = self.path.node();
		   var pathLength = pathEl.getTotalLength();

		   var BBox = pathEl.getBBox();

		   console.log(BBox);
		   var scale = pathLength/BBox.width;
		   var offsetLeft = document.getElementById("line").offsetLeft;

		window.setInterval(function() {

	      // var x = d3.event.pageX ; 

	      // x = 500;
	      $('#current_count').html(currentCount);
	      var x = Math.random() * pathLength;

	      // var x = Math.random() * BBox.width / scale;
	      // console.log(x);
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

	      var radius = Math.random() * (pathLength  - x )/10;
	      if (radius > maxRadius) {
	      	radius = maxRadius;
	      }
	      if (radius < 1 ) { radius = 1}

	      // var star = d3.select("#Layer_1:svg");
	      // var circle = svg.select(function() {
	      // 		return this.appendChild(document.getElementById("spark_1").cloneNode(true));
	      // })
	      var circle = svg.append("circle")
	      	// .attr('filter','url(#i1)') // need to find a better way because this is too heavy for browsers...

	        .attr("opacity", 1)
	        .attr("cx", x + (Math.random() * threshold*2 - threshold))
	        .attr("cy", pos.y + (Math.random() * threshold*2 - threshold))
	        .attr("r", 0)
	        .attr("fill", "white")
	        .transition()
			    .delay(function(d,i) { return Math.random() *  500 * i; })
			    .duration(Math.random() * animSpeed + animSpeed )
			    .attr("r", radius)
			    .style('opacity', 0)
			.remove(function() {
			self.currentCount--;

			});

	      $('#current_count').html(currentCount);

	    }, 0);

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
		setThreshold : setThreshold,
		setAnimSpeed : setAnimSpeed,
		getAnimSpeed :getAnimSpeed,
		setMaxRadius : setMaxRadius
	}


}

$(document).ready(function() {
	var s = new SPARKLER('#line', {
		maxCount : 100
	});

	s.init();

	$('#threshold').mousemove( function() {
	    var newValue = $(this).val();
	    $('#threshold_label').html(newValue);
	    s.setThreshold(newValue);
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
