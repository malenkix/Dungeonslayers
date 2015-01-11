var DS = DS || {};

(function(DS) {
	DS.ExperienceTable = [
		0,
		100,
		300,
		600,
		1000,
		1500,
		2100,
		2800,
		3600,
		4500,
		5500,
		6600,
		7800,
		9100,
		10500,
		12000,
		13700,
		15600,
		17700,
		20000,
	];

	DS.HeroClassExperienceTable = [
		0,
		100,
		300,
		600,
		1000,
		1500,
		2100,
		2800,
		3600,
		4500,
		6000,
		7600,
		9300,
		11100,
		13000,
		15000,
		17200,
		19600,
		22200,
		25000,
	];

	DS.parse = function() {
		return ['abc', [{b: 'y', a: 'x'}, 'a']];
	};

	DS.Aliases = {
		body: ['Körper', 'KÖR', 'KÖ'],
		strength: ['Stärke', 'STÄ', 'ST'],
		toughness: ['Härte', 'HÄR', 'HÄ'],
		agility: ['Agilität', 'AGI', 'AG'],
		movement: ['Bewegung', 'BEW', 'BE'],
		dexterity: ['Geschick', 'GES', 'GE'],
		mind: ['Geist', 'GEI'],
		intellect: ['Verstand', 'VER', 'VE'],
		aura: ['Aura', 'AUR', 'AU'],

		vitality: ['Lebenskraft', 'Leben', 'LE', 'LK', 'LP', 'HP'],
		energy: ['Manakraft', 'Mana', 'MA', 'MK', 'MP'],
		defense: ['Abwehr', 'ABW', 'AB', 'PA'],
		initiative: ['Initiative', 'INI', 'IN'],
		running: ['Laufen', 'LAU', 'LA'],
		attack: ['Schlagen', 'NWB', 'WB'],
		shooting: ['Schießen', 'FWB', 'WB'],
		spellPower: ['Zaubern', 'Zauber', 'Zauberkraft', 'ZAU', 'ZA'],
		targetedSpellPower: ['Zielzaubern', 'Zielzauber', 'ZIE', 'ZI', 'ZZ'],
	};

	//this.setAliases

	DS.Attributes = function(data) {
		this.initialize(data);
	};

	DS.Attributes.prototype = {
		constructor: DS.Attributes,

		initialize: function(data) {
			data = _.isObject(data) ? data : {};

			this.body      = data.body      || 0;
			this.strength  = data.strength  || 0;
			this.toughness = data.toughness || 0;
			this.agility   = data.agility   || 0;
			this.movement  = data.movement  || 0;
			this.dexterity = data.dexterity || 0;
			this.mind      = data.mind      || 0;
			this.intellect = data.intellect || 0;
			this.aura      = data.aura      || 0;
		},

		getBody: function() {
			return this.body;
		},
		getStrength: function() {
			return this.strength;
		},
		getToughness: function() {
			return this.toughness;
		},
		getAgility: function() {
			return this.agility;
		},
		getMovement: function() {
			return this.movement;
		},
		getDexterity: function() {
			return this.dexterity;
		},
		getMind: function() {
			return this.mind;
		},
		getIntellect: function() {
			return this.intellect;
		},
		getAura: function() {
			return this.aura;
		},

		getVitality: function() {
			return this.getBody() + this.getToughness() + 10;
		},
		getEnergy: function() {
			return this.getMind() + this.getAura();
		},

		getDefense: function() {
			return this.getBody() + this.getToughness();
		},
		getInitiative: function() {
			return this.getAgility() + this.getMovement();
		},
		getRunning: function() {
			return this.getAgility() / 2 + 1;
		},
		getAttack: function() {
			return this.getBody() + this.getStrength();
		},
		getShooting: function() {
			return this.getAgility() + this.getDexterity();
		},
		getSpellPower: function() {
			return this.getMind() + this.getAura();
		},
		getTargetedSpellPower: function() {
			return this.getMind() + this.getDexterity();
		},
	};

	DS.Effect = function(bonus, attribute) {
		this.initialize(bonus, attribute);
	};

	DS.Effect.prototype = {
		constructor: DS.Effect,

		initialize: function(bonus, attribute) {
			this.bonus = bonus || 0;
			this.attribute = attribute || '';
		},

		getBonus: function() {
			return this.bonus;
		},

		getAttribute: function() {
			return this.attribute;
		},
	};

	DS.Effect.parse = function(str) {
		if (str instanceof DS.Effect) {
			return str;
		}
		else if (typeof(str) === 'string') {
			var parts = _.compact(_.map(str.trim().split(' '), function(s) { return s.trim(); }));
			if (parts.length >= 2) {
				if (!_.isNaN(parseFloat(parts[0]))) {
					return new DS.Effect(Number(parts.shift()), parts.join(' '));
				}
				else if (!_.isNaN(parseFloat(_.last(parts)))) {
					return new DS.Effect(Number(parts.pop()), parts.join(' '));
				}
			}
		}
		return null;
	};

	DS.Effects = function(items) {
		this.items = _.isArray(items) ? _.map(items, function(item) { return DS.Effect.parse(item) || item; }) : [];
	};

	DS.Effects.prototype = {
		constructor: DS.Effects,

		getItems: function() {
			return this.items;
		},
		getValueOfAttribute: function(name) {
			var sum = 0;
			_.each(this.getItems(), function(effect) {
				if (effect instanceof DS.Effect && effect.getAttribute() === name) {
					sum += effect.getBonus();
				}
			});
			return sum;
		},
	};

	DS.Effects.parse = function(str) {
		var parts = _.compact(_.map(str.trim().split(/[\,\;]/), function(s) { return s.trim(); }));
		var items = _.map(parts, function(str) {
			return DS.Effect.parse(str) || str;
		});
		return new DS.Effects(items);
	};

	DS.Talent = function(data) {
		this.initialize(data);
	};

	DS.Talent.prototype = {
		constructor: DS.Talent,

		initialize: function(data) {
			data = _.isObject(data) ? data : {};

			this.name         = data.name         || '';
			this.description  = data.description  || '';
			this.effects      = _.isArray(data.effects) ? _.map(data.effects, function(effects) {
				return new DS.Effects(effects);
			}) : [];
		},

		getName: function() {
			return this.name;
		},
		getDescription: function() {
			return this.description;
		},
		getEffects: function() {
			return this.effects;
		},
		getMaxLevel: function() {
			return this.getEffects().length;
		},
		getEffectsForLevel: function(level) {
			var effects = this.getEffects();
			return level >= 1 ? effects[Math.min(level - 1, effects.length -1)] : new DS.Effects();
		},
	};

	DS.Character = function(data, options) {
		this.initialize(data);
	};

	DS.Character.prototype = {
		constructor: DS.Character,

		initialize: function(data) {
			data = _.isObject(data) ? data : {};

			this.attributes = new DS.Attributes(data);
			
			this.name       = data.name       || '';
			this.experience = data.experience || 0;
		},

		getName: function() {
			return this.name;
		},
		getExperience: function() {
			return this.experience;
		},
		getLevel: function() {
			var experience = this.experience;
			return _.filter(DS.ExperienceTable, function(value) {
				return value <= experience;
			}).length;
		},
		getAttributes: function() {
			return this.attributes;
		},
		getValueOfAttribute: function(attribute) {
			var value = this.getAttributes()[attribute];
			return _.isNumber(value) ? value : null;
		},
		get: function(valueName) {
			return this.getValueOfAttribute(valueName) || 0;
		},

	};

	/*DS.CustomizedCharacter.prototype = {
		getVitality: function() {
			return DS.Character.prototype.getVitality.call(this) + this.getLevel() - 1;
		}
	};*/
})(DS);