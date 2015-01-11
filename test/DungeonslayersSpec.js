describe("DS.Effect", function() {
	describe("#getBonus", function() {
		it("should return the bonus height", function() {
			var effect = new DS.Effect(3, "Strength");
			assert.strictEqual(effect.getBonus(), 3);
		});
	});

	describe("#getAttribute", function() {
		it("should return the affected attribute's name", function() {
			var effect = new DS.Effect(3, "Strength");
			assert.strictEqual(effect.getAttribute(), "Strength");
		});
	});

	describe('#parse', function() {
		var assertParse = function(string, bonus, attribute) {
			var effect = DS.Effect.parse(string);
			assert.strictEqual(effect.getBonus(), bonus);
			assert.strictEqual(effect.getAttribute(), attribute);
		};

		it("should parse a given string and return an effect", function() {
			assertParse("+1 Strength", 1, "Strength");
			assertParse("+2 Toughness", 2, "Toughness");
			assertParse("-3 Strength", -3, "Strength");
			assertParse("Toughness +1", 1, "Toughness");
			assertParse("Strength    +2", 2, "Strength");
			assertParse("Strength -3", -3, "Strength");
		});

		it("should accept floating numbers as bonus", function() {
			assertParse("+0.5 Running", 0.5, "Running");
			assertParse("+1.5 Running", 1.5, "Running");
			assertParse("-1.5 Running", -1.5, "Running");
			assertParse("Running +0.5", 0.5, "Running");
			assertParse("Running +1.5", 1.5, "Running");
			assertParse("Running -1.5", -1.5, "Running");
		});

		it("should accept attribute names with spaces", function() {
			assertParse("+1 Spell power", 1, "Spell power");
			assertParse("+3 Spell power", 3, "Spell power");
			assertParse("-1 Spell power", -1, "Spell power");
			assertParse("Spell power +1", 1, "Spell power");
			assertParse("Spell power +1.5", 1.5, "Spell power");
			assertParse("Super mega ultra nice spell power -1.5", -1.5, "Super mega ultra nice spell power");
		});

		it("should return null if the given string cannot be parsed to an effect", function() {
			assert.isNull(DS.Effect.parse("Strength"));
			assert.isNull(DS.Effect.parse("Strength Strength"));
			assert.isNull(DS.Effect.parse("+1"));
			assert.isNull(DS.Effect.parse(""));
		});
	});
});

describe("DS.Character", function() {
	var character = null;
	
	beforeEach(function() {
		character = new DS.Character({
			name: 'Elon Eibenglanz',
			experience: 15600,
			body: 4,
		});
	});


	describe("#getName", function() {
		it("should return the full name of the character", function() {
			assert.strictEqual(character.getName(), 'Elon Eibenglanz');
		});
	});

	describe("#getExperience", function() {
		it("should return the number of collected experience points", function() {
			assert.strictEqual(character.getExperience(), 15600);
		});
	});

	describe("#getLevel", function() {
		it("should return the character's level", function() {
			assert.strictEqual(character.getLevel(), 18);
		});
	});

	describe("#getAttribute(name)", function() {
		it("should return the value of the given attribute", function() {
			assert.strictEqual(character.getAttribute("body"), 4);
		});
		it("should return null if the given attribute does not exist", function() {
			assert.strictEqual(character.getAttribute("boxdy"), null);
		});
	});
});
