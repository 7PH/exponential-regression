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
solve v0: 3225.422ms
RESULTS
        a = 0.3 -> 0.32850744209838423
        b = 0.6 -> 0.5642649371523555
        c = 1.7 -> 1.7620596268238664
    
solve v1: 253.244ms
RESULTS
        a = 0.3 -> 0.32850744209838423
        b = 0.6 -> 0.5642649371523555
        c = 1.7 -> 1.7620596268238664
    
solve v2: 195.047ms
RESULTS
        a = 0.3 -> 0.32850744209838423
        b = 0.6 -> 0.5642649371523555
        c = 1.7 -> 1.7620596268238664
```