import {ExpReg, ExpTools} from "../src/exponential-regression";
import * as fs from "fs";


// store path, can be a currently opened file in PowerSpy
const STORE_PATH: string = '/afs/cern.ch/user/b/braymond/Downloads/files/expreg.csv';
const N: number = 100;
let yOffset: number = 0;
const yRange: number = - 25;
const configs: TestConfig[] = [];
configs.push({
    title: 'diverging, range ok',
    a: (yOffset = yOffset + yRange),
    b: 10,
    c: 0.02,
    XMIN: 0,
    XMAX: 100,
    N: N,
    RANDOM: 3
});
configs.push({
    title: 'diverging, almost no noise',
    a: (yOffset = yOffset + yRange),
    b: 10,
    c: 0.02,
    XMIN: 0,
    XMAX: 100,
    N: N,
    RANDOM: 0.1
});
configs.push({
    title: 'diverging, bad range',
    a: (yOffset = yOffset + yRange),
    b: 10,
    c: 0.01,
    XMIN: 40,
    XMAX: 60,
    N: N,
    RANDOM: 3
});
configs.push({
    title: 'diverging, almost no noise, little range',
    a: (yOffset = yOffset + yRange),
    b: 10,
    c: 0.01,
    XMIN: 40,
    XMAX: 60,
    N: N,
    RANDOM: 0.1
});
configs.push({
    title: 'converging quick, range ok',
    a: (yOffset = yOffset + yRange),
    b: - 10,
    c: - 0.2,
    XMIN: 0,
    XMAX: 20,
    N: N,
    RANDOM: 3
});
configs.push({
    title: 'converging real quick, range ok',
    a: (yOffset = yOffset + yRange),
    b: - 10,
    c: - 2,
    XMIN: 0,
    XMAX: 20,
    N: N,
    RANDOM: 3
});
configs.push({
    title: 'converging quick, range too wide',
    a: (yOffset = yOffset + yRange),
    b: - 10,
    c: - 0.2,
    XMIN: 0,
    XMAX: 100,
    N: N,
    RANDOM: 3
});
configs.push({
    title: 'converging, almost no noise',
    a: (yOffset = yOffset + yRange),
    b: 10,
    c: - 0.05,
    XMIN: 0,
    XMAX: 100,
    N: N,
    RANDOM: 0.1
});
configs.push({
    title: 'converging, almost no noise',
    a: (yOffset = yOffset + yRange),
    b: 10,
    c: - 0.5,
    XMIN: 0,
    XMAX: 100,
    N: N,
    RANDOM: 0.1
});


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

interface TestConfig {
    title: string;
    a: number,
    b: number,
    c: number,
    XMIN: number,
    XMAX: number,
    N: number,
    RANDOM: number
}

const plots: any[] = [];

for (let i = 0; i < configs.length; ++ i) {
    const config: TestConfig = configs[i];
    let title: string = config.title
        .replace(/[, ]+/g, '-')
        .replace(/[-]+/g, '-');

    let f0: (x: number) => number = ExpTools.getExp(config.a, config.b, config.c);
    let f1: (x: number) => number = ExpTools.getRandomizedExp(config.a, config.b, config.c, config.RANDOM);

    // get points
    let pts0: { xk: number[], yk: number[] } = ExpTools.getPoints(f0, config.XMIN, config.XMAX, config.N);
    const plot0: { xk: number[], yk: number[], title: string } = {xk: pts0.xk, yk: pts0.yk, title: title + '-real-0'};
    let pts1: { xk: number[], yk: number[] } = ExpTools.getPoints(f1, config.XMIN, config.XMAX, config.N);
    const plot1: { xk: number[], yk: number[], title: string } = {xk: pts1.xk, yk: pts1.yk, title: title + '-real-1'};

    // result
    let solvedVariables: { a: number, b: number, c: number } = ExpReg.solve(pts1.xk, pts1.yk);

    // get points
    let solved: (x: number) => number = ExpTools.getExp(solvedVariables.a, solvedVariables.b, solvedVariables.c);
    let pts2: { xk: number[], yk: number[] } = ExpTools.getPoints(solved, config.XMIN, config.XMAX, config.N);
    const plot2: { xk: number[], yk: number[], title: string } = {xk: pts2.xk, yk: pts2.yk, title: title + '-approx'};

    plots.push(plot0, plot1, plot2);

    console.log(`RESULTS for ${config.title} - ${JSON.stringify(config)}
    -        a = ${Math.abs(config.a - solvedVariables.a).toFixed(4)} <- ${config.a} / ${solvedVariables.a}
    -        b = ${Math.abs(config.b - solvedVariables.b).toFixed(4)} <- ${config.b} / ${solvedVariables.b}
    -        c = ${Math.abs(config.c - solvedVariables.c).toFixed(4)} <- ${config.c} / ${solvedVariables.c}
`);
}


// plot
console.log("Store result in " + STORE_PATH);
storeResult(STORE_PATH, plots);