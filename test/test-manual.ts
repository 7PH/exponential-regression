import {ExpReg, ExpTools} from "../src/exponential-regression";
import * as fs from "fs";
import {TestSample, samples} from "./samples";

// store path, can be a currently opened file in PowerSpy
const STORE_PATH: string = '/afs/cern.ch/user/b/braymond/Downloads/files/expreg.csv';

/**
 *
 * @param path
 * @param signals
 */
function storeResult(path: string, signals: {xk: number[], yk: number[], title: string}[]): void {
    const x0: number = signals[0].xk[0];
    const deltax: number = signals[0].xk[1] - x0;

    let output: string = '';

    // title
    output += 'TIME,' + signals.map(signal => signal.title).join(',') + "\n";

    // first & second line
    output += x0 + ',' + signals.map(signal => signal.yk[0]).join(',') + "\n";
    output += deltax + ',' + signals.map(signal => signal.yk[1]).join(',') + "\n";

    // content
    const N: number = signals[0].yk.length;
    for (let i = 2; i < N; ++ i)
        output += '0,' + signals.map(signal => signal.yk[i]).join(',') + "\n";

    fs.writeFile(path, output, function(err) { if (err) throw err; });
}


/**
 *
 */
const plots: any[] = [];
for (let i = 0; i < samples.length; ++ i) {
    const sample: TestSample = samples[i];
    let title: string = `${sample.a}+${sample.b}*e^(${sample.c}*t)+R(${sample.RANDOM})`
        .replace(/[, ]+/g, '-')
        .replace(/[-]+/g, '-');

    let f0: (x: number) => number = ExpTools.getExp(sample.a, sample.b, sample.c);
    let f1: (x: number) => number = ExpTools.getRandomizedExp(sample.a, sample.b, sample.c, sample.RANDOM);

    // get points
    let pts0: { xk: number[], yk: number[] } = ExpTools.getPoints(f0, sample.XMIN, sample.XMAX, sample.N);
    const plot0: { xk: number[], yk: number[], title: string } = {xk: pts0.xk, yk: pts0.yk, title: title + '-real-0'};
    let pts1: { xk: number[], yk: number[] } = ExpTools.getPoints(f1, sample.XMIN, sample.XMAX, sample.N);
    const plot1: { xk: number[], yk: number[], title: string } = {xk: pts1.xk, yk: pts1.yk, title: title + '-real-1'};

    // result
    let solvedVariables: { a: number, b: number, c: number } = ExpReg.solveXKYK(pts1.xk, pts1.yk);

    // get points
    let solved: (x: number) => number = ExpTools.getExp(solvedVariables.a, solvedVariables.b, solvedVariables.c);
    let pts2: { xk: number[], yk: number[] } = ExpTools.getPoints(solved, sample.XMIN, sample.XMAX, sample.N);
    const plot2: { xk: number[], yk: number[], title: string } = {xk: pts2.xk, yk: pts2.yk, title: title + '-approx'};

    plots.push(plot0, plot1, plot2);

    console.log(`RESULTS for ${sample.title} - ${JSON.stringify(sample)}
    -        a = ${Math.abs(sample.a - solvedVariables.a).toFixed(4)} <- ${sample.a} / ${solvedVariables.a}
    -        b = ${Math.abs(sample.b - solvedVariables.b).toFixed(4)} <- ${sample.b} / ${solvedVariables.b}
    -        c = ${Math.abs(sample.c - solvedVariables.c).toFixed(4)} <- ${sample.c} / ${solvedVariables.c}
`);
}


// plot
console.log("Store result in " + STORE_PATH);
storeResult(STORE_PATH, plots);