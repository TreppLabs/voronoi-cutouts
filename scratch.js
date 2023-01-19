// using this here: https://codepen.io/georgedoescode/pen/JjJKPKL
import { SVG } from "https://cdn.skypack.dev/@svgdotjs/svg.js";
import {
  createVoronoiTessellation,
  random
} from "https://cdn.skypack.dev/@georgedoescode/generative-utils";

const width = 196;
const height = 196;

const svg = SVG().viewbox(0, 0, width, height);

svg.addTo("body");
function cyrb128(str) {
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
}

// Create cyrb128 state:
var seed = cyrb128("apples");
function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

function xoshiro128ss(a, b, c, d) {
    return function() {
        var t = b << 9, r = a * 5; r = (r << 7 | r >>> 25) * 9;
        c ^= a; d ^= b;
        b ^= c; a ^= d; c ^= t;
        d = d << 11 | d >>> 21;
        return (r >>> 0) / 4294967296;
    }
}

var rand = xoshiro128ss(seed[0], seed[1], seed[2], seed[3]);
// var rand = mulberry32(seed[0]);


const points = [...Array(40)].map(() => {
  return {
    x: rand() * width,
    y: rand() * height
  };
});

const tessellation = createVoronoiTessellation({
  // The width of our canvas/drawing space
  width,
  // The height of our canvas/drawing space
  height,
  // The generating points we just created
  points,
  // How much we should "even out" our cell dimensions
  relaxIterations: 3
});

const debug = true;

tessellation.cells.forEach((cell) => {
  if (debug) {
    svg.polygon(cell.points).fill("none").stroke("#1D1934");
  }
});
