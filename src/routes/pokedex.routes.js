const express = require('express')
const router = express.Router()

const isAuthenticated = require('../middlewares/auth.middleware')
const controller = require('../controllers/pokedex.controller')
const dto = require('../dto/pokedex.dto')

router.get('/', isAuthenticated, controller.controllerPokedexGet)
router.patch('/', isAuthenticated, dto.dtoPokedexAdd, controller.controllerPokedexAdd)
router.delete('/', isAuthenticated, dto.dtoPokedexRemove, controller.controllerPokedexRemove)

module.exports = router
