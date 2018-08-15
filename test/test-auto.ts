import {samples, TestSample} from "./samples";
import {ExpReg, ExpTools} from "../src/exponential-regression";


/**
 * The test pass if the relative error on every test sample (@see ./samples) is less than this %
 * The relative error is the sum of the relative errors of each parameters (a, b and c)
 */
const TOLERANCE: number = 0.03; // 3%

/**
 * Test suite
 */
describe('it', function () {

    for (const sample of samples)
        it('should be ok for ' + sample.title, function(done) {

            // build exp function based on parameters
            const expFun: (x: number) => number = ExpTools.getExp(sample.a, sample.b, sample.c);

            // get some points
            const points: {xk: number[], yk: number[]} = ExpTools.getPoints(expFun, sample.XMIN, sample.XMAX, sample.N);

            // make regression
            const solved: {a: number, b: number, c: number} = ExpReg.solveXKYK(points.xk, points.yk);

            // compute error
            const relativeError: number =
                Math.abs((solved.a - sample.a) / sample.a)
                + Math.abs((solved.b - sample.b) / sample.b)
                + Math.abs((solved.c - sample.c) / sample.c);

            // verify error is tolerated
            if (relativeError > TOLERANCE)
                throw new Error(`Error is too big (${Math.floor(100 * relativeError)}%) expected less than ${Math.floor(100 * TOLERANCE)}%`);

            done();
        });
});