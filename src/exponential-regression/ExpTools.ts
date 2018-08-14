
export class ExpTools {

    /**
     * Get an exponential function with constant term
     * @param {number} a
     * @param {number} b
     * @param {number} c
     * @returns {(x: number) => number}
     */
    static getExp(a: number, b: number, c: number): (x: number) => number {
        return (x: number) => a + b * Math.exp(c * x);
    }

    /**
     * Get a randomized exponential function
     * @param {number} a
     * @param {number} b
     * @param {number} c
     * @param {number} d
     * @returns {(x: number) => number}
     */
    static getRandomizedExp(a: number, b: number, c: number, d: number): (x: number) => number {
        let exp = ExpTools.getExp(a, b, c);
        return (x: number) => {
            return exp(x) + (Math.random() - 0.5) * d;
        };
    }

    /**
     * Adapt a list of points [[x0, y0], [x1, y1], ..] to two list of points [x0, x1, ..] and [y0, y1, ..]
     * @param {number[][]} points list of points
     */
    static adaptPoints(points: number[][]): {xk: number[], yk: number[]} {
        return points.reduce((prev: {xk: number[], yk: number[]}, curr: number[]) => {
            prev.xk.push(curr[0]);
            prev.yk.push(curr[1]);
            return prev;
        }, {xk: [], yk: []});
    }

    /**
     * Builds a list of points with the right format for ExpReg.solveXKYK
     * @param {(x: number) => number} f Exponential function
     * @param {number} min Minimum of the range
     * @param {number} max Maximum of the range
     * @param {number} num Number of points
     */
    static getPoints(f: (x: number) => number, min: number, max: number, num: number): {xk: number[], yk: number[]} {
        // xk = [0, 1, ..., N]
        const xk: number[] = [];
        for (let k: number = 0; k < num; ++ k)
            xk.push(min + (k / num) * (max - min));

        // yk = f(xk)
        const yk: number[] = [];
        for (let k: number = 0; k < xk.length; ++ k)
            yk.push(f(xk[k]));

        return {
            xk: xk,
            yk: yk
        }
    }
}