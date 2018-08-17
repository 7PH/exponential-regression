
export interface TestSample {
    title: string;
    a: number,
    b: number,
    c: number,
    XMIN: number,
    XMAX: number,
    N: number,
    RANDOM: number
}

export const samples: TestSample[] = [];

const N: number = 1000;
let yOffset: number = 0;
const yRange: number = - 25;
samples.push({
    title: 'diverging, range ok',
    a: (yOffset = yOffset + yRange),
    b: 10,
    c: 0.02,
    XMIN: 0,
    XMAX: 100,
    N: N,
    RANDOM: 3
});
samples.push({
    title: 'diverging, almost no noise',
    a: (yOffset = yOffset + yRange),
    b: 10,
    c: 0.02,
    XMIN: 0,
    XMAX: 100,
    N: N,
    RANDOM: 0.1
});
samples.push({
    title: 'diverging, bad range',
    a: (yOffset = yOffset + yRange),
    b: 10,
    c: 0.01,
    XMIN: 40,
    XMAX: 60,
    N: N,
    RANDOM: 3
});
samples.push({
    title: 'diverging, almost no noise, little range',
    a: (yOffset = yOffset + yRange),
    b: 10,
    c: 0.01,
    XMIN: 40,
    XMAX: 60,
    N: N,
    RANDOM: 0.1
});
samples.push({
    title: 'converging quick, range ok',
    a: (yOffset = yOffset + yRange),
    b: - 10,
    c: - 0.2,
    XMIN: 0,
    XMAX: 20,
    N: N,
    RANDOM: 3
});
samples.push({
    title: 'converging real quick, range ok',
    a: (yOffset = yOffset + yRange),
    b: - 10,
    c: - 2,
    XMIN: 0,
    XMAX: 20,
    N: N,
    RANDOM: 3
});
samples.push({
    title: 'converging quick, range too wide',
    a: (yOffset = yOffset + yRange),
    b: - 10,
    c: - 0.2,
    XMIN: 0,
    XMAX: 100,
    N: N,
    RANDOM: 3
});
samples.push({
    title: 'converging, little noise',
    a: (yOffset = yOffset + yRange),
    b: 10,
    c: - 0.05,
    XMIN: 0,
    XMAX: 100,
    N: N,
    RANDOM: 0.1
});
samples.push({
    title: 'converging, little noise',
    a: (yOffset = yOffset + yRange),
    b: 10,
    c: - 0.5,
    XMIN: 0,
    XMAX: 100,
    N: N,
    RANDOM: 0.1
});
samples.push({
    title: 'converging, almost no noise',
    a: (yOffset = yOffset + yRange),
    b: 10,
    c: - 0.05,
    XMIN: 0,
    XMAX: 100,
    N: N,
    RANDOM: 0.01
});
samples.push({
    title: 'converging, almost no noise',
    a: (yOffset = yOffset + yRange),
    b: 10,
    c: - 0.5,
    XMIN: 0,
    XMAX: 100,
    N: N,
    RANDOM: 0.01
});