# Exponential regression

This library provides a simple non-iterative way to make an exponential regression.

It can support a non-zero constant term, that is:

```javascript
t => a + b * exp(c * t)
```

given a set of points, it will give back the approximations of a, b and c.

## Interface

Here are the available methods to get the approximation of (a, b, c):

```typescript
RegExp.solve(xk: number[], yk: number[]): {a: number, b: number, c: number}
RegExp.solveWithPoints(points: number[][]): {a: number, b: number, c: number}
RegExp.solveWithY(origin: number, period: number, yk: number[]): {a: number, b: number, c: number}
```

## Benchmark

Here is the benchmark result for the different solve methods

```typescript
parameters:
const a: number = 0.3;
const b: number = 0.6;
const c: number = - 1.7;
const RANDOM: number = 0.2; // noise amplitude

const XMIN: number = 0;
const XMAX: number = 20;
const N: number = 1000000; // number of points
```

```text
function                                                    ms              values
solve(xk: number[], yk: number[]) [old]                     1466 ms         [0.3, 0.64, -1.93]
solve(xk: number[], yk: number[]) [old]                     48 ms           [0.3, 0.64, -1.93]
solve(xk: number[], yk: number[]) [optimized]               21 ms           [0.3, 0.64, -1.93]
solve(o: number, t: number, yk: number[]) [optimized]       55 ms           [0.3, 0.64, -1.93]
solve(points: number[][]) [optimized]                       30 ms           [0.3, 0.64, -1.93]
```

## Credits

Many thanks to Jean Jacquelin for his paper [REGRESSION & FULL EQUATIONS](https://www.researchgate.net/profile/Mohammad_Elnesr/post/Is_it_possible_to_find_the_root_without_providing_an_initial_guess_starting_point/attachment/59d63eadc49f478072ea9315/AS%3A273771590553603%401442283641886/download/14674814-Regressions-et-equations-integrales.pdf)