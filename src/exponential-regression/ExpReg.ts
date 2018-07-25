/**
 * @author Benjamin RAYMOND
 * Inspired from the work of Jean JACQUELIN
 */
export class ExpReg {

    static sum(l: number[]): number {
        return l.reduce((prev, curr) => prev + curr, 0);
    }

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

    static multMat22WithVect(mat1: number[][], mat2: number[]): number[] {
        return [
            mat1[0][0] * mat2[0] + mat1[0][1] * mat2[1],
            mat1[1][0] * mat2[0] + mat1[1][1] * mat2[1]
        ];
    }

    static solve(xk: number[], yk: number[]): {a: number, b: number, c: number} {
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

    static solve1(xk: number[], yk: number[]): {a: number, b: number, c: number} {
        return ExpReg.solve(xk, yk);
    }

    static solve2(xk: number[], yk: number[]): {a: number, b: number, c: number} {
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

    static solve3(xk: number[], yk: number[]): {a: number, b: number, c: number} {
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