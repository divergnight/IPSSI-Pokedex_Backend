const express = require('express')
const router = express.Router()

const controller = require('../controllers/login.controller')
const dto = require('../dto/login.dto')

router.post('/register', dto.dtoRegister, controller.controllerUserRegister)
router.post('/login', controller.controllerUserLogin)

module.exports = router
