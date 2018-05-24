const expect = require('expect.js');
const {
    sum,
    calculDistance
} = require('./index.js');

describe(`The method 'sum',`, () => {
    it(`Should return 3 given 1 and 2 as inputs.`, () => {
        expect(sum(1, 2)).to.equal(3);
    });
});

describe(`The method 'calculDistance',`, () => {
    const suite = [
        {
            coordA: {
                lat: 48.812920,
                lon: 2.207042
            },
            coordB: {
                lat: 48.803762,
                lon: 2.278886
            },
            expected: 5359
        }
    ];

    suite.forEach(test => {
        it(`Should return ${test.expected} for the given coordinates.`, () => {
            const dist = calculDistance(test.coordA, test.coordB);

            expect(dist).to.equal(test.expected);
        });
    });
});
