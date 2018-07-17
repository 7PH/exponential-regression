import {ExpReg} from "../src/exponential-regression";
import {ExpTools} from "../src/exponential-regression/ExpTools";


// params
const a: number = 0.3;
const b: number = -0.6;
const c: number = -1.7;
const XMIN: number = -1;
const XMAX: number = 1;
const N: number = 10;
const RANDOM: number = 0.1;
let f: (x: number) => number = ExpTools.getRandomizedExp(a, b, c, RANDOM);

// get points
const {xk, yk}: {xk: number[], yk: number[]} = ExpTools.getPoints(f, XMIN, XMAX, N);

// solve
console.time('solve');
let solved: {a: number, b: number, c: number} = ExpReg.solve(xk, yk);
console.timeEnd('solve');

// display result
console.log(`
RESULTS
    a = ${a} -> ${solved.a}
    b = ${b} -> ${solved.b}
    c = ${c} -> ${solved.c}
`);

// solve
console.time('solve 2');
solved = ExpReg.solve2(xk, yk);
console.timeEnd('solve 2');

// display result
console.log(`
RESULTS
    a = ${a} -> ${solved.a}
    b = ${b} -> ${solved.b}
    c = ${c} -> ${solved.c}
`);

