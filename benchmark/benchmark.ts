import {ExpReg} from "../src/exponential-regression";
import {ExpTools} from "../src/exponential-regression";


// params
const a: number = 0.3;
const b: number = 0.6;
const c: number = - 1.7;
const XMIN: number = 0;
const XMAX: number = 20;
const N: number = 1000000;
const RANDOM: number = 0.2;
let f: (x: number) => number = ExpTools.getRandomizedExp(a, b, c, RANDOM);

// get points
const {xk, yk}: {xk: number[], yk: number[]} = ExpTools.getPoints(f, XMIN, XMAX, N);

// result
let solved: {a: number, b: number, c: number};

// solve
let solveFun: any[] = [ExpReg.solve3, ExpReg.solve2, ExpReg.solve1];
for (let i = 1; i < solveFun.length + 1; ++i) {
    let solve: any = solveFun[i - 1];
    // this is for code caching
    for (let j = 0; j < 4; ++ j)
        solve(xk, yk);
    // bench
    console.time(solve.name);
    solved = solve(xk, yk);
    console.timeEnd(solve.name);
}
