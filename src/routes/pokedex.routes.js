const express = require('express')
const router = express.Router()

const { isAuthenticated } = require('../middlewares/auth.middleware')
const controller = require('../controllers/pokedex.controller')

router.get('/', isAuthenticated, controller.controllerPokedexGet)
router.get('/unlock', isAuthenticated, controller.controllerPokedexUnlock)
router.get('/piece', isAuthenticated, controller.controllerPokedexGetPiece)

module.exports = router
