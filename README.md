# Exponential regression <img src="https://api.travis-ci.com/7PH/exponential-regression.svg?branch=master">

This library provides a fast and simple non-iterative way to make exponential regressions, based on the work of Jean Jacquelin in his paper [REGRESSION & FULL EQUATIONS](https://scikit-guess.readthedocs.io/en/latest/appendices/reei/translation.html)

It also supports a non-zero constant term, that is any function of the form:

```javascript
t => a + b * exp(c * t)
// (a, b, c) ϵ ℝ³
```

It accepts various form of input for the points, that is:
* (fastest) `solve([x0, x1, ..], [y0, y1, ..])`
* `solve(origin, period, [y0, y1, ..])`
* `solve([[t0, y0], [t1, y1], ..])`

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
RegExp.solve(origin: number, period: number, yk: number[]): RegressionResult
RegExp.solve(xyk: number[][]): RegressionResult
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
A performance comparison between the three input formats is provided below, with the following parameters
```typescript
const A: number = 0.3;
const B: number = 0.6;
const C: number = - 1.7;
const XMIN: number = 0;
const XMAX: number = 20;
const N: number = 1000000; // number of points
```

Result:
```text
function                                                    ms
solve(xk: number[], yk: number[]) [optimized]               21 ms
solve(o: number, t: number, yk: number[]) [optimized]       55 ms
solve(points: number[][]) [optimized]                       30 ms
```

To run this benchmark, use
```bash
npm run bench
```
