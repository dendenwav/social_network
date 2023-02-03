import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

// Importez votre modèle d'utilisateur
import User from '../models/User.js';

// Charger votre secret jwt
import secret from './keys.js';

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret;

passport.use(
    new Strategy(opts, (jwt_payload, done) => {
    User.findById(jwt_payload.id)
        .then(user => {
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        })
        .catch(err => console.log(err));
    })
);

export default passport;