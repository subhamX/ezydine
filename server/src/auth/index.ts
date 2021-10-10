import { Router } from 'express'
import * as dotenv from 'dotenv'
import * as bcrypt from 'bcrypt'
import passport from 'passport'
import { IVerifyOptions } from "passport-local";
import { generateErrorPayload } from '../utils/generate_err_payload';
import { PrismaClient } from '.prisma/client';


dotenv.config()
const app = Router()


app.get('/status', (req, res) => {
    try {
        if (req.isAuthenticated()) {
            let { hashed_password, ...userData } = req.user;
            res.json({
                user: userData,
                message: 'Successfully logged into private route',
            })
        } else {
            throw new Error("User not authenticated")
        }
    } catch (err) {
        res.json(generateErrorPayload(err.message))
    }
})

// register a new user
app.post('/register/', async (req, res, next) => {
    try {
        const prisma = new PrismaClient();
        const instance = await prisma.user.findUnique({
            where: {
                email: req.body.email
            }
        })
        if (instance) {
            throw Error('User Name or Email already exists')
        }
        // user doesn't exist
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        //   insert the user into Users table in database

        let userData = await prisma.user.create({
            data: {
                email: req.body.email,
                hashed_password: hashedPassword,
                name: req.body.name,
                // this registration is only for managers
            }
        })



        req.logIn(userData, (err) => {
            if (err) { return next(err); }
            res.send({
                error: false,
                role: userData.role,
                message: `User ${req.body.email} successfully registered`,
            })
        })


    } catch (err) {
        res.send({ error: true, message: err.message })
    }
})

// ## Login
app.post('/login/', async (req, res, next) => {
    try {
        passport.authenticate("local", (err: Error, user, info: IVerifyOptions) => {
            if (err) { return next(err); }
            if (!user) {
                res.send({ "error": true, message: info.message });
            }
            req.logIn(user, (err) => {
                if (err) { return next(err); }
                let { password, current_token, ...user } = req.user as any;
                res.send({ "error": false, message: "Success! You are logged in.", user });
            });
        })(req, res, next);
    } catch (err) {
        res.send({ error: true, message: err.message })
    }
})

// ## logout
app.post('/logout', async (req, res) => {
    try {
        req.logout();
        req.session.destroy(function (err) {
            res.send({ error: false, message: 'Logged out successfully!' })
        });
    } catch (err) {
        res.send({
            error: true,
            message: err.message,
        })
    }
})

export default app