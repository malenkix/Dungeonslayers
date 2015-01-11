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

describe("DS.Effects", function() {
	var assertEffect = function(effect, bonus, attribute) {
		assert.instanceOf(effect, DS.Effect);
		assert.strictEqual(effect.getBonus(), bonus);
		assert.strictEqual(effect.getAttribute(), attribute);
	};

	it("should contain all given elements", function() {
		var effects = new DS.Effects([ "abc", "+2 B", "-1.5 D" ]);
		assert.lengthOf(effects.items, 3);
		assert.strictEqual(effects.items[0], "abc");
		assertEffect(effects.items[1], 2, "B");
		assertEffect(effects.items[2], -1.5, "D");
	});

	describe('#parse', function() {
		it("should parse a given string and return an instance of DS.Effects, containing the parsed effects", function() {
			var effects = DS.Effects.parse("+1 Strength, +2 Toughness;     -1 Aura");
			assert.lengthOf(effects.items, 3);
			assertEffect(effects.items[0], 1, "Strength");
			assertEffect(effects.items[1], 2, "Toughness");
			assertEffect(effects.items[2], -1, "Aura");
		});
	});

	describe('#getValueOfAttribute', function() {
		it("should return the sum of all values of the given attribute's name", function() {
			var effects = new DS.Effects([
				new DS.Effect(1, "Strength"),
				new DS.Effect(2, "Toughness"),
				new DS.Effect(3, "Aura"),
				new DS.Effect(-2, "Strength"),
				new DS.Effect(1, "Aura"),
			]);
			assert.strictEqual(effects.getValueOfAttribute("Strength"), -1);
			assert.strictEqual(effects.getValueOfAttribute("Toughness"), 2);
			assert.strictEqual(effects.getValueOfAttribute("Aura"), 4);
			assert.strictEqual(effects.getValueOfAttribute("Mind"), 0);
		});
	});
});

describe("DS.Talent", function() {
	var assertEffect = function(effect, bonus, attribute) {
		assert.instanceOf(effect, DS.Effect);
		assert.strictEqual(effect.getBonus(), bonus);
		assert.strictEqual(effect.getAttribute(), attribute);
	};

	var talent = null;

	beforeEach(function() {
		talent = new DS.Talent({
			name: 'Kämpfer',
			description: 'Steigert Kampffähigkeit im Nahkampf',
			effects: [
				['Strength +1', 'Toughness +1'],
				['Strength +2', 'Toughness +2'],
				['Strength +3', 'Toughness +4'],
			],
		});
	});

	describe("#getName", function() {
		it("should return the talent's name", function() {
			assert.strictEqual(talent.getName(), 'Kämpfer');
		});
	});

	describe("#getDescription", function() {
		it("should return the talent's description", function() {
			assert.strictEqual(talent.getDescription(), 'Steigert Kampffähigkeit im Nahkampf');
		});
	});

	describe("#getEffects", function() {
		it("should return the talent's effects for each level as an array of instances of DS.Effects", function() {
			assert.isArray(talent.getEffects());
			assert.lengthOf(talent.getEffects(), 3);
			talent.getEffects().forEach(function(effect) {
				assert.instanceOf(effect, DS.Effects);
			});
		});
	});

	describe("#getEffectsForLevel", function() {
		it("should return the talent's effects for the given level", function() {
			assertEffect(talent.getEffectsForLevel(1).getItems()[0], 1, "Strength");
			assertEffect(talent.getEffectsForLevel(1).getItems()[1], 1, "Toughness");
			assertEffect(talent.getEffectsForLevel(2).getItems()[0], 2, "Strength");
			assertEffect(talent.getEffectsForLevel(2).getItems()[1], 2, "Toughness");
			assertEffect(talent.getEffectsForLevel(3).getItems()[0], 3, "Strength");
			assertEffect(talent.getEffectsForLevel(3).getItems()[1], 4, "Toughness");
		});
		it("should return the highest effects if the given level is greater than the talent's maximum level", function() {
			assertEffect(talent.getEffectsForLevel(4).getItems()[0], 3, "Strength");
			assertEffect(talent.getEffectsForLevel(4).getItems()[1], 4, "Toughness");
			assertEffect(talent.getEffectsForLevel(197).getItems()[0], 3, "Strength");
			assertEffect(talent.getEffectsForLevel(197).getItems()[1], 4, "Toughness");
		});
		it("should return an empty instance of DS.Effects if the given level is below 1", function() {
			assert.lengthOf(talent.getEffectsForLevel(0).getItems(), 0);
			assert.lengthOf(talent.getEffectsForLevel(-197).getItems(), 0);
		});
	});

	describe("#getMaxLevel", function() {
		it("should return the talent's maximum level", function() {
			assert.strictEqual(talent.getMaxLevel(), 3);
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

	describe("#getValueOfAttribute", function() {
		it("should return the value of the given attribute", function() {
			assert.strictEqual(character.getValueOfAttribute("body"), 4);
		});
		it("should return null if the given attribute does not exist", function() {
			assert.strictEqual(character.getValueOfAttribute("boxdy"), null);
		});
	});
});
