import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import { createUserService } from "@/services/user.service.ts";
import prismaDb from "@/db/prismaDb";

// TODO(miha): Get from config
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const userService = createUserService({ db: prismaDb });

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
};

passport.use(
    new JwtStrategy(opts, async (payload, done) => {
        try {
            const [user, error] = await userService.getByUsername(payload.sub);
            if (error) return done(error, false);
            if (user) return done(null, user);
            return done(null, false);
        } catch (err) {
            return done(err, false);
        }
    })
);

export default passport;
