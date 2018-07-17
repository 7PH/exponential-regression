# Exponential regression

This library provides a simple non-iterative way to make an exponential regression.

It can support a non-zero constant term, that is:

```javascript
t => a + b * exp(c * t)
```

given a set of points, it will give back the approximations of a, b and c.

## Benchmark

Here is the benchmark result for the methods solve, solve2, solve3.

When published, solve3 will be used as solve.

```text
solve v0: 333.477ms
solve v1: 27.777ms
solve v2: 21.431ms
```