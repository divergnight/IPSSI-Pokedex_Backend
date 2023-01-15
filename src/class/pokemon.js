class Pokemon {
	id
	name
	currentHp
	level
	baseStats
	stats
	types
	relations

	constructor(data) {
		this.id = data.id
		this.name = data.name
		this.setBaseStats(data.stats)
		this.setLevel(50)
		this.types = data.types.map(e => e.type.name)
		this.relations = {}
		this.currentHp = this.stats.hp
	}

	setBaseStats(stats) {
		let baseStats = this.baseStats ?? {}
		let i = 0
		while (i < stats.length) {
			switch (stats[i].stat.name) {
				case 'hp':
					baseStats.hp = stats[i].base_stat
					break
				case 'attack':
					baseStats.atk = stats[i].base_stat
					break
				case 'defense':
					baseStats.def = stats[i].base_stat
					break
				case 'special-attack':
					baseStats.atkSpe = stats[i].base_stat
					break
				case 'special-defense':
					baseStats.defSpe = stats[i].base_stat
					break
				case 'speed':
					baseStats.spd = stats[i].base_stat
					break
				default:
					break
			}
			i++
		}
		this.baseStats = baseStats
	}

	setLevel(level) {
		this.level = level
		let stats = {}
		const IV = 15
		const EV = 85
		Object.entries(this.baseStats).map(e => {
			if (e[0] === 'hp') {
				stats.hp = Math.abs(Math.floor(((2 * e[1] + IV + Math.abs(Math.floor(EV / 4))) * level) / 100)) + level + 10
			} else {
				stats[e[0]] = Math.abs(Math.floor(((2 * e[1] + IV + Math.abs(Math.floor(EV / 4))) * level) / 100)) + 5
			}
		})
		this.stats = stats
	}

	sufferDamageFrom(enemy) {
		const isSpe = enemy.stats.atk < enemy.stats.atkSpe
		const ATK = isSpe ? enemy.stats.atkSpe : enemy.stats.atk
		const DEF = isSpe ? this.stats.defSpe : this.stats.def
		const POWER = 60 // moves not implemented
		const STAB = 1 // moves not implemented
		const types = this.relations[enemy.types[0]] ?? 1 // moves not implemented
		const rand = (100 - Math.floor(Math.random() * 16)) / 100
		const isCrit = Math.floor(Math.random() * 24) === 0 ? 1.5 : 1

		// CM multiplier partially implemented
		const CM = isCrit * rand * STAB * types

		const damage = Math.floor((((Math.floor(0.4 * enemy.level) + 2) * POWER * ATK) / DEF / 50 + 2) * CM)
		this.currentHp -= damage
		return {
			damage,
			typeMultiplier: types,
			isCrit: isCrit === 1,
		}
	}

	shortBrief() {
		return {
			id: this.id,
			level: this.level,
			maxHp: this.stats.hp,
		}
	}
}

module.exports = Pokemon
