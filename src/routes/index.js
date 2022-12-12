const express = require('express')
const router = express.Router()

const loginRoutes = require('./login.routes')
const pokedexRoutes = require('./pokedex.routes')

router.use('/', loginRoutes)
router.use('/pokedex', pokedexRoutes)

module.exports = router
