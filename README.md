# Exponential regression

This library provides a fast and simple non-iterative way to make exponential regressions.

It also supports a non-zero constant term, that is every function of the form:

```javascript
t => a + b * exp(c * t)
// (a, b, c) ϵ ℝ³
```

It accepts various form of input for the points, that is:
* `solve([x0, x1, ..], [y0, y1, ..])`
* `sovle([[t0, y0], [t1, y1], ..])`
* `solve(origin, period, [y0, y1, ..])`

The fastest being the first one.

Small example:
```javascript
// import
const ExpReg = require('exponential-regression').ExpReg;

// create dataset (5 values)
const a = 1, b = 2, c = -0.5;
const exp = t => a + b * Math.exp(c * t);
const t = [0, 1, 2, 3, 4];
const y = t.map(exp);

// make regression
const solved = ExpReg.solve(t, y);

// output result
console.log(solved);
/*
 * { a: 0.9827848677867319,
 *   b: 2.014213829585767,
 *   c: -0.4898373248074215 }
 */
```

## Install
The easiest way to install this is using `npm`
```bash
npm i --save exponential-regression
```

## How to use

Here are the available methods to get the approximation of (a, b, c):

```typescript
type RegressionResult {a: number; b: number; c: number;}

RegExp.solve(xk: number[], yk: number[]): RegressionResult
RegExp.solve(xyk: number[][]): RegressionResult
RegExp.solve(origin: number, period: number, yk: number[]): RegressionResult
```

## Test
### Automatic tests
Tests are made with mocha. To run them, use
```bash
npm run test
```
Automatic tests ensure the relative error is less than a certain percentage for every test sample.
Test samples are in `test/samples.ts`.

### Manual tests
You can store the csv file corresponding to the test samples using
```bash
npm run test-manual $STORE_PATH
```
`$STORE_PATH` is the path where you would like to store the csv file.

## Benchmark
Benchmark has been done using these parameters
```typescript
const A: number = 0.3;
const B: number = 0.6;
const C: number = - 1.7;
const XMIN: number = 0;
const XMAX: number = 20;
const N: number = 1000000; // number of points
```


```text
function                                                    ms
solve(xk: number[], yk: number[]) [old]                     1466 ms
solve(xk: number[], yk: number[]) [old]                     48 ms
solve(xk: number[], yk: number[]) [optimized]               21 ms
solve(o: number, t: number, yk: number[]) [optimized]       55 ms
solve(points: number[][]) [optimized]                       30 ms
```

To run the benchmark, use
```bash
npm run bench
```

## Credits

Many thanks to Jean Jacquelin for his paper [REGRESSION & FULL EQUATIONS](https://docs.google.com/viewerng/viewer?url=https://vdocuments.mx/google-reader?url%3D8bf88bb8494245d48534059c6e5d1b8630a73b474ac5d81f4256b8e456b73e62687c7d053aaa7a02c5163509a87f56011550c0a5a8201ce15dee2389157b4bd0033QA6JE21/IeptLczb4ix0/zlsBeCp26DZcX5Wd3+EgqAF1Gs3rPJ1fkz0OpaiNJiMJDH4HxZHe44KC3asnyQ%3D%3D)
