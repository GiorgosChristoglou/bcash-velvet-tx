const ChainInterlink = require('../src/chain_interlink');
const sinon = require("sinon");
const should = require("should");
const assert = require("assert");
const fixtures = require("./fixtures");

describe("ChainInterlink", () => {
	var interlink = null;

	beforeEach("get interlink", () => {
		interlink = new ChainInterlink();
  });

	it("Computes correctly the levels of superblocks", () => {
		should(interlink.computeLevel(fixtures.blockHeaders.genesis)).equal(36);
		should(interlink.computeLevel(fixtures.blockHeaders.firstBlock)).equal(32);
		should(interlink.computeLevel(fixtures.blockHeaders.secondBlock)).equal(33);
	});

	describe("Interlink values", () => {
		it("Produces undefined interlink for genesis", () => {
			interlink.update(fixtures.blockHeaders.genesis, 0);

			let hash = Buffer.from(fixtures.blockHeaders.genesis);

			should(interlink.getInterlinkHash(hash)).equal(undefined);
		});

		it("Populates all the interlink with the genesis hash", () => {
			interlink.update(fixtures.blockHeaders.genesis, 0);

			let hash = Buffer.from(fixtures.blockHeaders.genesis, 'hex');

			var allSame = true;
			for (var i = 0; i <= 256; i++) {
				allSame = allSame && (interlink.interlink[i].hash.equals(hash));
			}

			should(allSame).equal(true);
		});

		it("Updates correctly the levels", () => {
			interlink.update(fixtures.blockHeaders.genesis, 0);
			interlink.update(fixtures.blockHeaders.firstBlock, 1);

			should(interlink.interlink[/* level= */ 32].height).equal(1);
			should(interlink.interlink[/* level= */ 36].height).equal(0);

			interlink.update(fixtures.blockHeaders.secondBlock, 2);

			should(interlink.interlink[/* level= */ 33].height).equal(2);
		});
	});
});