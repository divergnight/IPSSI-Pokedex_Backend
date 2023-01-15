const express = require('express')
const router = express.Router()

const controller = require('../controllers/fight.controller')

router.ws('/matchmaking', controller.controllerFightMatchMaking)

module.exports = router
