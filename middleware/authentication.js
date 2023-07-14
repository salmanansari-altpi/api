const jwt = require('jsonwebtoken')

const checkToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    if (token) {
        jwt.verify(token, process.env.jwt_sec, (err, data) => {
            if (err) {
                console.log(err.message);
            } else {
                req.user = data.id
            }
        })
    } else {
        console.log('Token Not Found');
    }
    next()
}

module.exports = checkToken