
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

    // this is the most important part;  elemets - an array of elements to animate; anims - animations, anims[x] = {element, windowScroll initial position, windowScroll end position, initial styles, end styles}
    elements = [
        document.getElementById("globe_small")
      , document.getElementById("globe_medium")
      , document.getElementById("globe_large")
      , document.getElementById("campain-overlay__header")
      , document.getElementById("movie_titles")
    ],

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
