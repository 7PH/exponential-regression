import {ExpReg} from "../src/exponential-regression";
import {ExpTools} from "../src/exponential-regression";


// params
const a: number = 0.3;
const b: number = 0.6;
const c: number = - 1.7;
const XMIN: number = 0;
const XMAX: number = 20;
const N: number = 1000;
const RANDOM: number = 0.2;
let f: (x: number) => number = ExpTools.getRandomizedExp(a, b, c, RANDOM);

// get points
const {xk, yk}: {xk: number[], yk: number[]} = ExpTools.getPoints(f, XMIN, XMAX, N);

// result
let solved: {a: number, b: number, c: number};

// solve
let solveFun: any[] = [ExpReg.solve, ExpReg.solve2, ExpReg.solve3];
for (let i = 0; i < solveFun.length; ++i) {
    let solve: any = solveFun[i];
    // cache
    for (let j = 0; j < 1000; ++ j)
        solve(xk, yk);
    // bench
    console.time('solve' + i);
    for (let j = 0; j < 1000; ++ j)
        solved = solve(xk, yk);
    console.timeEnd('solve' + i);
}
