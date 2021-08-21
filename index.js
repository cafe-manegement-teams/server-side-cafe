const express = require('express')
const app = express();
const db = require('./api/db')

const staffRoute = require('./api/routers/staff.route')
const loginRoute = require('./api/routers/login.route')
// const logoutRoute = require('./routes/logout.route')
const registerRoute = require('./api/routers/register.route')
// const middleware = require('./middlewares/auth.middleware')

const bodyParser = require('body-parser')

// var cookieParser = require('cookie-parser')
// app.use(cookieParser())

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


app.use('/staff', staffRoute)
app.use('/user', registerRoute)
app.use('/login', loginRoute)
// GET POST PUT DELETE PATCH

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Listening on port',PORT))

