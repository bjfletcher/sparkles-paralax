//requestAnimationFrame polyfill

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


// main animation loop


Math.easeOutSine = function (t, b, c, d) {
	return c * Math.sin(t/d * (Math.PI/2)) + b;
};

Math.easeInSine = function (t, b, c, d) {
	return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
};

Math.easeOutCubic = function (t, b, c, d) {
	t /= d;
	t--;
	return c*(t*t*t + 1) + b;
};


window.onload = function(){
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	var W = 1330, H = 400;
	canvas.width = W;
	canvas.height = H;
	
	var particles = [];

	var particle_count = 1;
	for(var i = 0; i < particle_count; i++)
	{
		particles.push(new particle());
	}

	function particle() {
		// movement speed from the origin
		this.speed = {x: -2.5+Math.random()*5, y: -2.5+Math.random()*5};
		this.posx = Math.random() * W;
		this.posy = Math.random() * H;
		this.opacity = Math.random();
		this.radius = {
			current : 0,
			max : Math.random() * 50 + 1
		},
		this.life = this.radius.max/2 +Math.random()*10 + 10;
		this.remaining_life = this.life;
		// this.maxOpacity = Math.random() * 10 + 10;
		this.opacity = {
			current : 0,
			max : Math.random()
		}

	}

	// draw particle
	function draw() {
		ctx.fillStyle = "#113776";
		ctx.fillRect(0, 0, W, H);
		ctx.fillStyle = "white";
		ctx.shadowBlur = 0;
		ctx.drawSvg(document.getElementById('line').outerHTML, 0, 0, W, H);

		for(var i = 0; i < particles.length; i++) {
			var p = particles[i];
			ctx.beginPath();

			ctx.fillStyle = "rgba(255, 255, 255," + p.opacity.max+");" ;
			ctx.shadowBlur = 10;

		   	ctx.shadowOffsetX = 0;
		   	ctx.shadowOffsetY = 0;
		   	ctx.shadowColor="#FFFFFF"
			ctx.arc(p.posx, p.posy, p.radius.current, Math.PI*2, false);


			// p.opacity = 1; Math.round(p.remaining_life/p.life*p.maxOpacity)/p.maxOpacity;

			// p.opacity = Math.easeOutCubic(p.life, p.remaining_life, (p.remaining_life - p.life).current, 1000)

			ctx.fill();

			if (p.radius.current < p.radius.max) {
				p.radius.current = Math.easeOutCubic(1, p.radius.current, (p.radius.max-p.radius.current), p.remaining_life)
			}

			//console.log(p.remaining_life)

			if (p.opacity.current > 0) {
				p.opacity.current = o 
			}


			p.remaining_life--;

			if (p.remaining_life <= 0) {
				particles[i] = new particle();
			}
		}
	}

	function test(initialVal, finalVal, timer) {

		this.val = 1;

		this.t = 0 //(we’re just starting, so 0 seconds have passed)
		this.b = initialVal //(the beginning value of the property being tweened)
		this.c = finalVal - initialVal //(the change in value – so the destination value of 200 minus the start value of 50 equals 150)
		this.d = timer/10//(total duration of 1 second)

		var i = 0;

		// while ( this.t < this.d) {
		// 	console.log(Math.easeOutSine(this.t, this.b, this.c, this.d));
		// 	this.t++;
		// }


		var c = window.setInterval(function() {
			console.log(Math.easeOutSine(this.t, this.b, this.c, this.d));
			this.t++;

			if (t == d) {
				window.clearInterval(c);
			}
		}, 10)

	}

	// test(0, 200, 2000);
	setInterval(draw, 33);

};
