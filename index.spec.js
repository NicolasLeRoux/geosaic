const expect = require('expect.js');
const { sum } = require('./index.js');

describe(`The method 'sum',`, () => {
    it(`Should return 3 given 1 and 2 as inputs.`, () => {
        expect(sum(1, 2)).to.equal(3);
    });
});
