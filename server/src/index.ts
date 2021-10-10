import Express, { Request, Response } from 'express'
import spot from './routes/spot'
import auth from './auth/index'
import cookie_parser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import Pool from 'pg-pool';
import { User as UserSchema } from '@prisma/client'

const app = Express();

declare global {
    namespace Express {
        interface User extends UserSchema {

        }
    }
}


app.set('trust proxy', 1);

// middleware function to force HTTPS
app.use((req: Request, res: Response, next: any) => {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === "production") {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
});

// Configuring connect pg for persistent sessions
const pgSession = require('connect-pg-simple')(session);
app.use(
    cors({
        // origin: '/',
        credentials: true,
    })
);

// configuring express session
app.use(
    session({
        store: new pgSession({
            pool: new Pool({ connectionString: process.env.DATABASE_URL, ssl: false }),
            tableName: 'session'
        }),
        saveUninitialized: false,
        secret: (process.env.SESSION_SECRET as string ?? 'TEST'),
        resave: false,
        cookie: process.env.NODE_ENV === 'production' ? { secure: true, sameSite: 'strict' } : {},
    })
);
// Configuring cookie and json parser middleware
app.use(cookie_parser())

app.use(Express.json());


// Configuring passport middleware for authentication
require("./auth/passport_config")(passport);
app.use(passport.initialize());
app.use(passport.session())



app.use('/api/spot/', spot);
app.use('/api/auth/', auth);




app.get('/', (req, res) => {
    res.send({
        status: 'OK',
        message: 'Hello World'
    })
})


app.listen(process.env.PORT, () => {
    console.log(`Listening on Port ${process.env.PORT}`)
})
