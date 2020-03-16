// 验证jwt
const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt
const Users = require('../Schemas/userSchema')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret'

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        Users.findById(jwt_payload.id)
            .then(user => {
                if (user) {
                    return done(null, user)
                }
                return done(null, false)
            })
            .catch(err => {console.log(err)})
    }))
}