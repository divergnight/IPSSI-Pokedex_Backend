const express = require('express')
const router = express.Router()

const loginRoutes = require('./login.routes')
const pokedexRoutes = require('./pokedex.routes')
const fightRoutes = require('./fight.routes')

router.use('/', loginRoutes)
router.use('/pokedex', pokedexRoutes)
router.use('/fight', fightRoutes)

module.exports = router
