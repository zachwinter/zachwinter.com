export const PI = Math.PI
export const PI2 = PI * 2
export const PI180 = PI / 180

export function init (hidpi = true) {
  const canvas = createCanvas()
  const ctx = canvas.getContext('2d')
  const { width, height, dpi } = sizeCanvas(ctx, hidpi)

  return {
    canvas,
    ctx,
    width,
    height,
    dpi
  }
}

export function createCanvas (container = document.body) {
  const canvas = document.createElement('canvas')
  container.appendChild(canvas)
  return canvas
}

export function sizeCanvas (ctx, hidpi) {
  const dpi = hidpi ? (window.devicePixelRatio || 1) : 1 
  ctx.canvas.width = window.innerWidth * dpi
	ctx.canvas.height = window.innerHeight * dpi
	ctx.canvas.style.width = window.innerWidth + 'px'
	ctx.canvas.style.height = window.innerHeight + 'px'
	if (hidpi) ctx.scale(dpi, dpi)
	
	return {
		width: window.innerWidth,
		height: window.innerHeight,
		dpi
	}
}

export function toRadians (angle) {
	return PI * angle / 180
}

export function x (radius, theta, cx = 0) {
	return radius * Math.cos(theta) + cx
}

export function y (radius, theta, cy = 0) {
	return radius * Math.sin(theta) + cy
}

export function coords (radius, theta, cx = 0, cy = 0) {
	return {
		x: x(radius, theta, cx),
		y: y(radius, theta, cy)
	}
}

export function distance (x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

export function polygon (sides, radius, cx = 0, cy = 0, rotation = 0) {
	const angle = 360/sides
	const vertices = []

	for (var i = 0; i < sides; i++) {
		const _coords = coords(radius, toRadians((angle * i) + rotation), cx, cy)
		vertices.push(_coords)
	}

	return vertices
}

export function createStar (points, innerRadius, outerRadius, cx = 0, cy = 0, rotation = 0, round = false) {
  const outer = polygon(points, outerRadius, cx, cy, rotation)
  const inner = polygon(points, innerRadius, cx, cy, (360 / points / 2) + rotation)
  const vertices = []
  
  for (var i = 0; i < points; i++) {
    vertices.push({ x: outer[i].x, y: outer[i].y })
    vertices.push({ x: inner[i].x, y: inner[i].y })
  }

  return { outer, inner, vertices }
}

export function circle (ctx, radius, x, y, start = 0, end = PI2) {
	ctx.beginPath()
	ctx.arc(x, y, radius, start, end)
	ctx.closePath()
	return ctx
}

export function roundRect (ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
	}
}

export function drawShape (ctx, vertices) {
  vertices.forEach(({ x, y }, i) => {
    if (i === 0) {
      ctx.beginPath()
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })

  ctx.closePath()
  return ctx
}

export function sin (ctx, xOffset, yOffset, amplitude, frequency, {
  tick = 1,
  fillBelow = false,
  fillAbove = false
} = {}) {
  const y = x => (amplitude * Math.sin((x / frequency) + xOffset) + yOffset)

  const { width } = ctx.canvas 

  ctx.beginPath()

  for (var x = 0; x < width; x += tick) {
    if (x === 0) {
      ctx.moveTo(x, y(x))
    } else {
      ctx.lineTo(x, y(x))
    }

    if (x === width - 1) {
      if (fillBelow === true) {
        ctx.lineTo(x, ctx.canvas.height)
        ctx.lineTo(0, ctx.canvas.height)
      }
    }
  }

  if (fillBelow === true) {
    ctx.lineTo(ctx.canvas.width / window.devicePixelRatio, ctx.canvas.height / window.devicePixelRatio)
    ctx.lineTo(0, ctx.canvas.height / window.devicePixelRatio)
    ctx.closePath()
    ctx.fill()
  } else if (fillAbove === true) {
    ctx.lineTo(ctx.canvas.width / window.devicePixelRatio, 0)
    ctx.lineTo(0, 0)
    ctx.closePath()
    ctx.fill()
  } else {
    ctx.stroke()
  }
}

export function graph (ctx, width, fn, tick = 5) {
  ctx.beginPath()
  for (let x = -tick; x < width + tick; x += tick) {
    if (x === 0) {
      ctx.moveTo(x, fn(x))
    } else{
      ctx.lineTo(x, fn(x))
    }
  }
  ctx.stroke()
}

export function drawCurve(ctx, ptsa, tension, isClosed, numOfSegments, showPoints) {

  ctx.beginPath();

  drawLines(ctx, getCurvePoints(ptsa, tension, isClosed, numOfSegments));
  
  if (showPoints) {
    ctx.beginPath();
    for(var i=0;i<ptsa.length-1;i+=2) 
      ctx.rect(ptsa[i] - 2, ptsa[i+1] - 2, 4, 4);
  }

  ctx.stroke();
}

export function drawLines(ctx, pts) {
  ctx.moveTo(pts[0], pts[1]);
  for(var i=2;i<pts.length-1;i+=2) ctx.lineTo(pts[i], pts[i+1]);
}

export function getCurvePoints(pts, tension, isClosed, numOfSegments) {

  // use input value if provided, or use a default value	 
  tension = (typeof tension != 'undefined') ? tension : 0.5;
  isClosed = isClosed ? isClosed : false;
  numOfSegments = numOfSegments ? numOfSegments : 16;

  var _pts = [], res = [],	// clone array
      x, y,			// our x,y coords
      t1x, t2x, t1y, t2y,	// tension vectors
      c1, c2, c3, c4,		// cardinal points
      st, t, i;		// steps based on num. of segments

  // clone array so we don't change the original
  //
  _pts = pts.slice(0);

  // The algorithm require a previous and next point to the actual point array.
  // Check if we will draw closed or open curve.
  // If closed, copy end points to beginning and first points to end
  // If open, duplicate first points to befinning, end points to end
  if (isClosed) {
    _pts.unshift(pts[pts.length - 1]);
    _pts.unshift(pts[pts.length - 2]);
    _pts.unshift(pts[pts.length - 1]);
    _pts.unshift(pts[pts.length - 2]);
    _pts.push(pts[0]);
    _pts.push(pts[1]);
  }
  else {
    _pts.unshift(pts[1]);	//copy 1. point and insert at beginning
    _pts.unshift(pts[0]);
    _pts.push(pts[pts.length - 2]);	//copy last point and append
    _pts.push(pts[pts.length - 1]);
  }

  // ok, lets start..

  // 1. loop goes through point array
  // 2. loop goes through each segment between the 2 pts + 1e point before and after
  for (i=2; i < (_pts.length - 4); i+=2) {
    for (t=0; t <= numOfSegments; t++) {

      // calc tension vectors
      t1x = (_pts[i+2] - _pts[i-2]) * tension;
      t2x = (_pts[i+4] - _pts[i]) * tension;

      t1y = (_pts[i+3] - _pts[i-1]) * tension;
      t2y = (_pts[i+5] - _pts[i+1]) * tension;

      // calc step
      st = t / numOfSegments;

      // calc cardinals
      c1 =   2 * Math.pow(st, 3) 	- 3 * Math.pow(st, 2) + 1; 
      c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2); 
      c3 = 	   Math.pow(st, 3)	- 2 * Math.pow(st, 2) + st; 
      c4 = 	   Math.pow(st, 3)	- 	  Math.pow(st, 2);

      // calc x and y cords with common control vectors
      x = c1 * _pts[i]	+ c2 * _pts[i+2] + c3 * t1x + c4 * t2x;
      y = c1 * _pts[i+1]	+ c2 * _pts[i+3] + c3 * t1y + c4 * t2y;

      //store points in array
      res.push(x);
      res.push(y);

    }
  }

  return res;
}



/**
 * 
 * 

 SINE SIVE AROUND CIRCLE


const RADIUS = 200
const AMPLITUDE = 20
const SIDES = Math.PI * Math.sin(now/200) + Math.PI

function x (radius, amplitude, angle, x, sides, rotation) {
  return (radius + (amplitude * Math.sin(sides * (angle + rotation)))) * Math.cos(angle) + x
}

function y (radius, amplitude, angle, y, sides, rotation) {
  return (radius + (amplitude * Math.sin(sides * (angle + rotation)))) * Math.sin(angle) + y
}

ctx.beginPath()

for (let i = 0; i <= Math.PI * 2; i+= .01) {
  const _x = x(RADIUS, AMPLITUDE, i, width/2, SIDES, now/5000)
  const _y = y(RADIUS, AMPLITUDE, i, height/2, SIDES, now/5000)

  if (i === 0) {
    ctx.moveTo(_x, _y)
  } else {
    ctx.lineTo(_x, _y)
  }
}

ctx.stroke()

 */