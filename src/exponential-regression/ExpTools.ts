
export class ExpTools {

    static getExp(a: number, b: number, c: number): (x: number) => number {
        return (x: number) => a + b * Math.exp(c * x);
    }

    static getRandomizedExp(a: number, b: number, c: number, d: number): (x: number) => number {
        let exp = ExpTools.getExp(a, b, c);
        return (x: number) => {
            return exp(x) + (Math.random() - 0.5) * d;
        };
    }

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