import authApi from './api/auth.js';
import bcrypt from 'bcryptjs';
import express from 'express';
import fileApi from './api/file.js';
import folderApi from './api/folder.js';
import passport from 'passport';
import prisma from './db/prisma.js';
import session from 'express-session';
import userApi from './api/user.js';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { createUserService } from './services/user.js';
import { Strategy as LocalStrategy } from 'passport-local';

const app = express();

const UserService = createUserService();

// TODO(miha): move this to its own file and call initPassport or something...
passport.use(
    new LocalStrategy(
        { usernameField: "username" },
        async (username, password, done) => {
            try {
                // TODO(miha): Move this to AuthService (transaction just to be sure)
                const user = await UserService.getByUsername(username);
                if (!user)
                    return done(null, false, { message: "Username not found" });

                const match = await bcrypt.compare(password, user.passwordHash);
                if (!match)
                    return done(null, false, { message: "Wrong password" })

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserService.getByUuid(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.use(session({
    secret: process.env.SESSION_SECRET || "default secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    store: new PrismaSessionStore(prisma, {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
    }),
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => res.send("ok"));
app.use('/files', fileApi);
app.use('/folders', folderApi);
app.use('/users', userApi);
app.use('/auth', authApi);




export default app;
