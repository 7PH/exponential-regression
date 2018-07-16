

export class Exp {

    static getExp(a: number, b: number, c: number): (x: number) => number {
        return (x: number) => a + b * Math.exp(c * x);
    }

    static getRandExp(a: number, b: number, c: number, d: number): (x: number) => number {
        let exp = Exp.getExp(a, b, c);
        return (x: number) => {
            return exp(x) + (Math.random() - 0.5) * d;
        };
    }

    static sum(l: number[]): number {
        let r: number = 0;
        l.forEach(n => r += n);
        return r;
    }
}