const { FifoMatchmaker } = require('matchmaking')
const PokeAPI = require('pokedex-promise-v2')
const Pokemon = require('../class/pokemon')
const Pokedex = require('../models/pokedex.models')
const User = require('../models/user.models')

let matchmaking = new FifoMatchmaker(runGame, getPlayerKey, { checkInterval: 2000 })
let users = []

function runGame(players) {
	players = players.map(v => {
		return { ...v, ...users.filter(e => e.id === v.id)[0] }
	})

	players.forEach(player => {
		player.ws.send(
			JSON.stringify({
				status: 'process',
			})
		)
	})

	const P = new PokeAPI()
	Promise.all(
		players.map(async player => {
			player.pokemon = await Promise.all(
				(
					await P.getPokemonByName(player.pokemon)
				).map(async p => {
					const pokemon = new Pokemon(p)
					;(await P.getTypeByName(pokemon.types)).forEach(t => {
						t.damage_relations.double_damage_from.forEach(r => {
							pokemon.relations[r.name] = 2 * (pokemon.relations[r.name] ?? 1)
						})
						t.damage_relations.half_damage_from.forEach(r => {
							pokemon.relations[r.name] = 0.5 * (pokemon.relations[r.name] ?? 1)
						})
						t.damage_relations.no_damage_from.forEach(r => {
							pokemon.relations[r.name] = 0
						})
					})
					return pokemon
				})
			)
			return player
		})
	).then(players => {
		const briefPokemons = players.map(player => {
			return {
				your: player.pokemon.map(p => p.shortBrief()),
				opponent: players.filter(p => p.id !== player.id)[0].pokemon.map(p => p.shortBrief()),
			}
		})
		const [id, steps] = simulateBattle(players)

		players.map(async (player, i) => {
			const isWinner = id === player.id
			player.ws.send(
				JSON.stringify({
					status: isWinner ? 'win' : 'lose',
					detail: {
						pokemons: briefPokemons[i],
						steps: steps.map(step => {
							let tmp = { ...step }
							tmp.turn = step.turn === player.id ? 'your' : 'opponent'
							return tmp
						}),
					},
				})
			)
			if (isWinner) {
				const user = await User.findById({ _id: player.id })
				user.piece++
				await user.save()
			}
		})
	})
}

function getPlayerKey(player) {
	return player.id
}

const simulateBattle = players => {
	players = [...players]
	steps = []

	while (true) {
		let sortedPlayers = players.sort((a, b) => b.pokemon[0].stats.spd - a.pokemon[0].stats.spd)

		let recap = sortedPlayers[1].pokemon[0].sufferDamageFrom(sortedPlayers[0].pokemon[0])
		steps.push({
			turn: sortedPlayers[0].id,
			action: 'attack',
			pokemon: sortedPlayers[0].pokemon[0].id,
			target: sortedPlayers[1].pokemon[0].id,
			recap,
		})
		if (sortedPlayers[1].pokemon[0].currentHp <= 0) {
			steps.push({
				turn: sortedPlayers[0].id,
				action: 'kill',
				pokemon: sortedPlayers[0].pokemon[0].id,
				target: sortedPlayers[1].pokemon[0].id,
			})
			sortedPlayers[1].pokemon.splice(0, 1)
			players = sortedPlayers
			if (players[1].pokemon.length === 0) return [players[0].id, steps]
			continue
		}

		recap = sortedPlayers[0].pokemon[0].sufferDamageFrom(sortedPlayers[1].pokemon[0])
		steps.push({
			turn: sortedPlayers[1].id,
			action: 'attack',
			pokemon: sortedPlayers[1].pokemon[0].id,
			target: sortedPlayers[0].pokemon[0].id,
			recap,
		})
		if (sortedPlayers[0].pokemon[0].currentHp <= 0) {
			steps.push({
				turn: sortedPlayers[1].id,
				action: 'kill',
				pokemon: sortedPlayers[1].pokemon[0].id,
				target: sortedPlayers[0].pokemon[0].id,
			})
			sortedPlayers[0].pokemon.splice(0, 1)

			players = sortedPlayers
			if (players[0].pokemon.length === 0) return [players[1].id, steps]
			continue
		}

		players = sortedPlayers
	}
}

const controllerFightMatchMaking = async (ws, req) => {
	try {
		ws.on('close', err => {
			users.forEach((user, index) => {
				if (user.ws.readyState >= 2) {
					let user = users.splice(index, 1)
					matchmaking.leaveQueue({ id: user[0].id })
				}
			})
		})
		ws.on('message', function (msg) {
			msg = JSON.parse(msg)
			req.body = msg
			console.log(msg)

			if (msg.action === 'join') {
				controllerFightJoinMatchMaking(ws, req)
			} else if (msg.action === 'leave') {
				controllerFightLeaveMatchMaking(ws, req)
			}
		})

		const user = await User.findById({ _id: req.user.id })
		if (!user) {
			ws.close()
		} else {
			if (user.length >= 2) user = []
			const index = users.findIndex((v, i) => v['id'] == req.user.id)
			if (index === -1) {
				users.push({ ws, id: req.user.id })
			} else {
				users[index].ws = ws
			}
		}
	} catch (err) {
		console.log(err)
	}
}

const controllerFightJoinMatchMaking = async (ws, req) => {
	try {
		const { pokemon } = req.body.data

		const pokedex = (await Pokedex.findOne({ user: req.user.id })).uid
		let i = 0
		while (i < pokemon.length) {
			if (!pokedex.includes(pokemon[i])) {
				ws.send(JSON.stringify({ status: 'refused', reason: "You don't own the pokemons you are trying to use." }))
				return
			}
			i++
		}

		matchmaking.push({ id: req.user.id, pokemon })

		ws.send(JSON.stringify({ status: 'pending' }))
	} catch (error) {
		console.log(error)
	}
}

const controllerFightLeaveMatchMaking = async (ws, req) => {
	try {
		matchmaking.leaveQueue({ id: req.user.id })

		ws.send(JSON.stringify({ status: 'leave' }))
	} catch (error) {
		console.log(error)
	}
}

module.exports = {
	controllerFightMatchMaking,
}
