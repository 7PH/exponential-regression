import * as math from "mathjs";
import {ExpTools} from "./ExpTools";

export class ExpReg {

    static solve(xk: number[], yk: number[]): {a: number, b: number, c: number} {
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
        const c11: number = ExpTools.sum(xk.map(x => Math.pow(x - xk[0], 2)));
        const c12: number = ExpTools.sum(xk.map((x, k) => (x - xk[0]) * Sk[k]));
        const c21: number = c12;
        const c22: number = ExpTools.sum(Sk.map(S => Math.pow(S, 2)));
        const C: math.Matrix = math.matrix([[c11, c12], [c21, c22]]);

        // D
        const d11: number = ExpTools.sum(xk.map((x, k) => (yk[k] - yk[0]) * (xk[k] - xk[0])));
        const d21: number = ExpTools.sum(yk.map((y, k) => (y - yk[0]) * Sk[k]));
        const D: math.Matrix = math.matrix([[d11], [d21]]);

        // A1, B1
        const AB: math.Matrix = math.multiply(math.inv(C), D) as math.Matrix;

        // c1, c2
        let c2: number = AB.get([1, 0]);

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
        const e12: number = ExpTools.sum(thetak);
        const e21: number = e12;
        const e22: number = ExpTools.sum(thetak.map(theta => Math.pow(theta, 2)));
        const E: math.Matrix = math.matrix([[e11, e12], [e21, e22]]);

        // F
        const f11: number = ExpTools.sum(yk);
        const f21: number = ExpTools.sum(yk.map((y, k) => y * thetak[k]));
        const F: math.Matrix = math.matrix([[f11], [f21]]);

        // a2, b2
        const ab: math.Matrix = math.multiply(math.inv(E), F) as math.Matrix;
        const a2: number = ab.get([0, 0]);
        const b2: number = ab.get([1, 0]);

        // return result
        return {
            a: a2,
            b: b2,
            c: c2
        };
    }
}