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
        },
        {
            coordA: {
                lat: 48.827182,
                lon: 2.235062
            },
            coordB: {
                lat: 48.827179,
                lon: 2.235075
            },
            expected: 1
        },
        {
            coordA: {
                lat: 48.829727,
                lon: 2.249323
            },
            coordB: {
                lat: 48.829531,
                lon: 2.249522
            },
            expected: 26
        },
        {
            coordA: {
                lat: 48.847929,
                lon: 2.205667
            },
            coordB: {
                lat: 48.847463,
                lon: 2.211067
            },
            expected: 399
        }
    ];

    suite.forEach(test => {
        it(`Should return ${test.expected}m for the given coordinates.`, () => {
            const dist = calculDistance(test.coordA, test.coordB);

            expect(dist).to.equal(test.expected);
        });
    });
});
