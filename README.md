# Exponential regression

This library provides a simple non-iterative way to make an exponential regression.

It can support a non-zero constant term, that is:

```javascript
t => a + b * exp(c * t)
```

given a set of points, it will give back the approximations of a, b and c.

## Benchmark

Here is the benchmark result for the methods solve (optimized), solve2 (previous version) and solve3 (first version).

```text
solve0: 21.467ms
solve1: 27.186ms
solve2: 331.194ms
```

## Credits

Many thanks to Jean Jacquelin for his paper 'REGRESSION & FULL EQUATIONS'