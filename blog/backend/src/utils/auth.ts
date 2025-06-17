import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import { createUserService } from '@/services/user.service';
import { DB } from '@/db/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const createPassportStrategy = (db: DB) => {
    const userService = createUserService({ db });

    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
    };

    passport.use(
        new JwtStrategy(opts, async (payload, done) => {
            try {
                const [user, error] = await userService.getById(payload.sub);

                if (error) return done(error, false);
                if (!user) return done(null, false);

                return done(null, user);
            } catch (err) {
                return done(err, false);
            }
        })
    );

    return passport;
}
