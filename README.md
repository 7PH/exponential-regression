# Exponential regression

This library provides a simple non-iterative way to make an exponential regression.

It can support a non-zero constant term, that is:

```javascript
t => a + b * exp(c * t)
```

given a set of points, it will give back the approximations of a, b and c.

## Benchmark

Here is the benchmark result for the methods solve (optimized), solve2 (previous version) and solve3 (first version).

```typescript
parameters:
const a: number = 0.3;
const b: number = 0.6;
const c: number = - 1.7;
const RANDOM: number = 0.2;

const XMIN: number = 0;
const XMAX: number = 20;
const N: number = 1000000; // number of points
```

```text
function                                ms              values
solve x+y [old]                         1480 ms         [0.3, 0.57, -1.52]
solve x+y [old]                         45 ms           [0.3, 0.57, -1.52]
solve x+y [optimized]                   23 ms           [0.3, 0.57, -1.52]
solve origin+period+y [optimized]       34 ms           [0.3, 0.57, -1.52]
```

## Credits

Many thanks to Jean Jacquelin for his paper [REGRESSION & FULL EQUATIONS](https://www.researchgate.net/profile/Mohammad_Elnesr/post/Is_it_possible_to_find_the_root_without_providing_an_initial_guess_starting_point/attachment/59d63eadc49f478072ea9315/AS%3A273771590553603%401442283641886/download/14674814-Regressions-et-equations-integrales.pdf)