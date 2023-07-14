const express = require('express')
const { register, login, updateUser, deleteUser } = require('../controller/user')
const checkToken = require('../middleware/authentication')
const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.put('/update/:id', checkToken, updateUser)
router.delete('/delete/:id', checkToken, deleteUser)

module.exports = router