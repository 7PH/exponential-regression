
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
}