/**
 * @author Benjamin RAYMOND
 * Inspired from the work of Jean JACQUELIN
 */

/**
 * Regression result
 */
export interface RegressionResult {a: number; b: number; c: number;}

/**
 * Main utility class
 */
export class ExpReg {

    /**
     * Compute the sum of a given list of numbers
     * @param l
     */
    static sum(l: number[]): number {
        return l.reduce((prev, curr) => prev + curr, 0);
    }

    /**
     * Get the inverse of a 2x2 matrix. Throw an error if det(mat) === 0
     * @param mat
     */
    static invMat22(mat: number[][]): number[][] {
        const a: number = mat[0][0];
        const b: number = mat[0][1];
        const c: number = mat[1][0];
        const d: number = mat[1][1];
        let coef: number = 1 / (a * d - b * c);
        return [
            [coef * d, - coef * b],
            [- coef * c, coef * a]
        ];
    }

    /**
     * Multiply two 2x2 matrices
     * @param mat1
     * @param mat2
     * @return mat1.mat2
     */
    static multMat22WithVect(mat1: number[][], mat2: number[]): number[] {
        return [
            mat1[0][0] * mat2[0] + mat1[0][1] * mat2[1],
            mat1[1][0] * mat2[0] + mat1[1][1] * mat2[1]
        ];
    }

    /**
     * Solve wrapper
     *      solve(xk: number[], yk: number[])
     *      solve(xyk: number[][])
     *      solve(origin: number, period: number, yk: number[])
     * @param a
     * @param b
     * @param c
     * @return the regression result
     */
    static solve(a: number[][] | number[] | number, b?: number[] | number, c?: number[]): RegressionResult {
        if (typeof a === 'number' && typeof b === 'number' && typeof c === 'object')
            return this.solveOPYK(a, b, c);
        else if (typeof a === 'object' && typeof a[0] === 'object' && typeof b === 'undefined' && typeof c === 'undefined')
            return this.solveXYK(a as number[][]);
        else if (typeof a === 'object' && typeof a[0] === 'number' && typeof b === 'object' && typeof c === 'undefined')
            return this.solveXKYK(a as number[], b);
        else
            throw new Error("Wrong parameters given to solve function");
    }

    /**
     * Solve with a different kind of input for the data
     * @param xyk
     */
    static solveXYK(xyk: number[][]): RegressionResult {
        const N: number = xyk.length;

        // sort points
        // {nothing to do}

        // Sk, C & D
        let Sk: number = 0,
            c11: number = 0,
            c12: number = 0,
            c22: number = 0,
            d1: number = 0,
            d2: number = 0;
        for (let k: number = 1; k < N; ++ k) {
            Sk = Sk + 0.5 * (xyk[k][1] + xyk[k - 1][1]) * (xyk[k][0] - xyk[k - 1][0]);
            c11 += Math.pow(xyk[k][0] - xyk[0][0], 2);
            c12 += (xyk[k][0] - xyk[0][0]) * Sk;
            c22 += Math.pow(Sk, 2);
            d1 += (xyk[k][1] - xyk[0][1]) * (xyk[k][0] - xyk[0][0]);
            d2 += (xyk[k][1] - xyk[0][1]) * Sk;
        }

        // c2
        let coef: number = 1 / (c11 * c22 - c12 * c12);
        let c2: number = (- coef * c12) * d1 + (coef * c11) * d2;

        // θk, E, F
        let theta: number = 0,
            // e11 = N
            e12: number = 0,
            // e21 = e12
            e22: number = 0,
            f1: number = 0,
            f2: number = 0;
        for (let k: number = 0; k < N; ++ k) {
            theta = Math.exp(c2 * xyk[k][0]);
            e12 += theta;
            e22 += Math.pow(theta, 2);
            f1 += xyk[k][1];
            f2 += xyk[k][1] * theta;
        }

        // a2, b2
        const ab: number[] = ExpReg.multMat22WithVect(ExpReg.invMat22([[N, e12], [e12, e22]]), [f1, f2]);

        // return result
        return {
            a: ab[0],
            b: ab[1],
            c: c2
        };
    }

    /**
     * Solve with a different kind of input for the data
     * @param origin
     * @param period
     * @param yk
     */
    static solveOPYK(origin: number, period: number, yk: number[]): RegressionResult {
        const N: number = yk.length;
        const xk: number[] = [origin, origin + period];

        // sort points
        // {nothing to do}

        // Sk, C & D
        let Sk: number = 0,
            c11: number = 0,
            c12: number = 0,
            c22: number = 0,
            d1: number = 0,
            d2: number = 0;
        for (let k: number = 1; k < N; ++ k) {
            Sk = Sk + 0.5 * (yk[k] + yk[k - 1]) * period;
            c11 += Math.pow(xk[k] - origin, 2);
            c12 += (xk[k] - origin) * Sk;
            c22 += Math.pow(Sk, 2);
            d1 += (yk[k] - yk[0]) * (xk[k] - origin);
            d2 += (yk[k] - yk[0]) * Sk;
            xk[k + 1] = xk[k] + period;
        }

        // c2
        let coef: number = 1 / (c11 * c22 - c12 * c12);
        let c2: number = (- coef * c12) * d1 + (coef * c11) * d2;

        // θk, E, F
        let theta: number = 0,
            // e11 = N
            e12: number = 0,
            // e21 = e12
            e22: number = 0,
            f1: number = 0,
            f2: number = 0;
        for (let k: number = 0; k < N; ++ k) {
            theta = Math.exp(c2 * xk[k]);
            e12 += theta;
            e22 += Math.pow(theta, 2);
            f1 += yk[k];
            f2 += yk[k] * theta;
        }

        // a2, b2
        const ab: number[] = ExpReg.multMat22WithVect(ExpReg.invMat22([[N, e12], [e12, e22]]), [f1, f2]);

        // return result
        return {
            a: ab[0],
            b: ab[1],
            c: c2
        };
    }

    /**
     * Final optimized implementation
     *  - re-use variables
     *  - use Sk as number, not array
     *  - we only need the lower part of C^(-1).D => only compute this part
     * @param xk
     * @param yk
     */
    static solveXKYK(xk: number[], yk: number[]): RegressionResult {
        const N: number = xk.length;

        // sort points
        // {nothing to do}

        // Sk, C & D
        let Sk: number = 0,
            c11: number = 0,
            c12: number = 0,
            c22: number = 0,
            d1: number = 0,
            d2: number = 0;
        for (let k: number = 1; k < N; ++ k) {
            Sk = Sk + 0.5 * (yk[k] + yk[k - 1]) * (xk[k] - xk[k - 1]);
            c11 += Math.pow(xk[k] - xk[0], 2);
            c12 += (xk[k] - xk[0]) * Sk;
            c22 += Math.pow(Sk, 2);
            d1 += (yk[k] - yk[0]) * (xk[k] - xk[0]);
            d2 += (yk[k] - yk[0]) * Sk;
        }

        // c2
        let coef: number = 1 / (c11 * c22 - c12 * c12);
        let c2: number = (- coef * c12) * d1 + (coef * c11) * d2;

        // θk, E, F
        let theta: number = 0,
            // e11 = N
            e12: number = 0,
            // e21 = e12
            e22: number = 0,
            f1: number = 0,
            f2: number = 0;
        for (let k: number = 0; k < N; ++ k) {
            theta = Math.exp(c2 * xk[k]);
            e12 += theta;
            e22 += Math.pow(theta, 2);
            f1 += yk[k];
            f2 += yk[k] * theta;
        }

        // a2, b2
        const ab: number[] = ExpReg.multMat22WithVect(ExpReg.invMat22([[N, e12], [e12, e22]]), [f1, f2]);

        // return result
        return {
            a: ab[0],
            b: ab[1],
            c: c2
        };
    }

    /**
     * Second implementation
     *  - merged loops
     * @param xk
     * @param yk
     */
    static solveXKYK2(xk: number[], yk: number[]): RegressionResult {
        const N: number = xk.length;

        // sort points
        // {nothing to do}

        let Sk: number[] = [0];
        for (let k: number = 1; k < xk.length; ++ k)
            Sk.push(Sk[k - 1] + 0.5 * (yk[k] + yk[k - 1]) * (xk[k] - xk[k - 1]));

        // Sk, C & D
        let c11: number = 0,
            c12: number = 0,
            // c21 = c12
            c22: number = 0,
            d1: number = 0,
            d2: number = 0;
        for (let k: number = 0; k < N; ++ k) {
            c11 += Math.pow(xk[k] - xk[0], 2);
            c12 += (xk[k] - xk[0]) * Sk[k];
            c22 += Math.pow(Sk[k], 2);
            d1 += (yk[k] - yk[0]) * (xk[k] - xk[0]);
            d2 += (yk[k] - yk[0]) * Sk[k];
        }
        const C: number[][] = [[c11, c12], [c12, c22]]; // c12 = c21
        const D: number[] = [d1, d2];


        // A1, B1
        const AB: number[] = ExpReg.multMat22WithVect(ExpReg.invMat22(C), D);

        // c2
        let c2: number = AB[1];

        // θk, E, F
        let theta: number = 0,
            // e11 = N
            e12: number = 0,
            // e21 = e12
            e22: number = 0,
            f1: number = 0,
            f2: number = 0;
        for (let k: number = 0; k < N; ++ k) {
            theta = Math.exp(c2 * xk[k]);
            e12 += theta;
            e22 += Math.pow(theta, 2);
            f1 += yk[k];
            f2 += yk[k] * theta;
        }
        const E: number[][] = [[N, e12], [e12, e22]];
        const F: number[] = [f1, f2];

        // a2, b2
        const ab: number[] = ExpReg.multMat22WithVect(ExpReg.invMat22(E), F);
        const a2: number = ab[0];
        const b2: number = ab[1];

        // return result
        return {
            a: a2,
            b: b2,
            c: c2
        };
    }

    /**
     * First not optimized version
     * @param xk
     * @param yk
     */
    static solveXKYK3(xk: number[], yk: number[]): RegressionResult {
        const N: number = xk.length;

        // sort points
        // {nothing to do}

        // Sk
        let Sk: number[] = [0];
        for (let k: number = 1; k < xk.length; ++ k)
            Sk.push(Sk[k - 1] + 0.5 * (yk[k] + yk[k - 1]) * (xk[k] - xk[k - 1]));

        /*
                                                        -1
            A1  .  | E((xk - x1)^2)   E(xk - x1)*Sk  | ^        | E(yk - y1) * (xk - x1)    |
            B1  '  | E(xk - x1)*Sk    E(Sk^2)        |     .    | E(yk - y1) * Sk           |

                               |__ C                                    |__ D

         */

        // C
        const c11: number = ExpReg.sum(xk.map(x => Math.pow(x - xk[0], 2)));
        const c12: number = ExpReg.sum(xk.map((x, k) => (x - xk[0]) * Sk[k]));
        const c21: number = c12;
        const c22: number = ExpReg.sum(Sk.map(S => Math.pow(S, 2)));
        const C: number[][] = [[c11, c12], [c21, c22]];

        // D
        const d11: number = ExpReg.sum(xk.map((x, k) => (yk[k] - yk[0]) * (xk[k] - xk[0])));
        const d21: number = ExpReg.sum(yk.map((y, k) => (y - yk[0]) * Sk[k]));
        const D: number[] = [d11, d21];

        // A1, B1
        const AB: number[] = ExpReg.multMat22WithVect(ExpReg.invMat22(C), D);

        // c2
        let c2: number = AB[1];

        // θk
        let thetak: number[] = [];
        for (let k: number = 0; k < xk.length; ++ k)
            thetak.push(Math.exp(c2 * xk[k]));


        /*
                                        -1
            a2  .  | n      E(θk)   | ^        | E(yk)    |
            b2  '  | E(θk)  E(θk^2) |     .    | E(yk*θk) |

                         |__ E                         |__ F

         */

        // E
        const e11: number = N;
        const e12: number = ExpReg.sum(thetak);
        const e21: number = e12;
        const e22: number = ExpReg.sum(thetak.map(theta => Math.pow(theta, 2)));
        const E: number[][] = [[e11, e12], [e21, e22]];

        // F
        const f11: number = ExpReg.sum(yk);
        const f21: number = ExpReg.sum(yk.map((y, k) => y * thetak[k]));
        const F: number[] = [f11, f21];

        // a2, b2
        const ab: number[] = ExpReg.multMat22WithVect(ExpReg.invMat22(E), F);
        const a2: number = ab[0];
        const b2: number = ab[1];

        // return result
        return {
            a: a2,
            b: b2,
            c: c2
        };
    }
}