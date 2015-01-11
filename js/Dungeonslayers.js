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
		getAttribute: function(attribute) {
			return this.getAttributes()[attribute] || 0;
		},
		get: function(valueName) {
			return this.getAttribute(valueName) || 0;
		},

	};

	/*DS.CustomizedCharacter.prototype = {
		getVitality: function() {
			return DS.Character.prototype.getVitality.call(this) + this.getLevel() - 1;
		}
	};*/
})(DS);