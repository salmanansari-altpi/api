const express = require('express')
require('dotenv/config')
const db = require('./db') 
const userRoute = require('./routes/users')

const app = express()

db.query('SELECT 1').then((data) => console.log('DB CONNECTED')).catch(err => console.log(err.message))

app.use(express.json())
app.use('/users', userRoute)

const PORT = 5000
app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`))