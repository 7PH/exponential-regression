import {ExpReg} from "../src/exponential-regression";
import {ExpTools} from "../src/exponential-regression/ExpTools";


// params
const a: number = 0.3;
const b: number = 0.6;
const c: number = -1.7;
const XMIN: number = -1;
const XMAX: number = 1;
const N: number = 10;
const RANDOM: number = 0.1;

// function
let f: (x: number) => number = ExpTools.getRandExp(a, b, c, RANDOM);

// xk = [0, 1, ..., N]
let xk: number[] = [];
for (let k: number = 0; k < N; ++ k)
    xk.push(XMIN + (k / N) * (XMAX - XMIN));

// yk = f(xk)
let yk: number[] = [];
for (let k: number = 0; k < xk.length; ++ k)
    yk.push(f(xk[k]));

// display values
console.log(`  xk         yk`);
for (let k: number = 0; k < xk.length; ++ k)
    console.log(`${xk[k].toFixed(2)}       ${yk[k].toFixed(2)}`);

// solve
let solved: {a: number, b: number, c: number} = ExpReg.solve(xk, yk);

// display result
console.log(`
RESULTS
    a = ${a} -> ${solved.a}
    b = ${b} -> ${solved.b}
    c = ${c} -> ${solved.c}
`);