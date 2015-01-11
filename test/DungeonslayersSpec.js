describe("DS.Character", function() {
	var character = null;
	
	beforeEach(function() {
		character = new DS.Character({
			name: 'Elon Eibenglanz',
			experience: 17465,
		});
	});


	describe("#getName", function() {
		it("should return the full name of the character", function() {
			assert.strictEqual(character.getName(), 'Elon Eibenglanz');
		});
	});

	describe("#getExperience", function() {
		it("should return the number of collected experience points", function() {
			assert.strictEqual(character.getExperience(), 17465);
		});
	});

	describe("#getLevel", function() {
		it("should return the character's level", function() {
			assert.strictEqual(character.getLevel(), 18);
		});
	});
});
