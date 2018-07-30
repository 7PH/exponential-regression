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
const origin: number = xk[0];
const period: number = xk[1] - xk[0];

// result
let solved: {a: number, b: number, c: number};

// solve
let solveFun: any = [
    {fun: ExpReg.solve3, name: 'solve x+y [old]', type: 'xy'},
    {fun: ExpReg.solve2, name: 'solve x+y [old]', type: 'xy'},
    {fun: ExpReg.solve, name: 'solve x+y [optimized]', type: 'xy'},
    {fun: ExpReg.solveByOrigin, name: 'solve origin+period+y [optimized]', type: 'oy'}
];


// benchmark
for (let solve of solveFun) {

    // this is for code caching
    for (let j = 0; j < 4; ++ j)
        if (solve.type === 'xy')
            solve.fun(xk, yk);
        else
            solve.fun(origin, period, yk);

    // bench
    const start = Date.now();
    if (solve.type === 'xy')
        solve.result = solve.fun(xk, yk);
    else
        solve.result = solve.fun(origin, period, yk);
    solve.duration = Date.now() - start;
}

// output
console.log('function' + " ".repeat(40 - 8) + 'ms' + " ".repeat(16 - 2) + 'values');
for (let solve of solveFun) {
    const name: string = solve.name;
    const dur: string = solve.duration.toString() + " ms";
    const res: string = JSON.stringify([
        solve.result.a,
        solve.result.b,
        solve.result.c
    ]   .map(v => v.toFixed(2))
        .map(parseFloat)
    ).replace(/,/g, ", ");
    console.log(name + " ".repeat(40 - name.length) + dur + " ".repeat(16 - dur.length) + res);
}