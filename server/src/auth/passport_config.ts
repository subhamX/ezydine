import { PassportStatic } from 'passport';
import passportLocal from 'passport-local';
import * as bcrypt from 'bcrypt'
import { PrismaClient, User } from '.prisma/client';
const LocalStrategy = passportLocal.Strategy;

const prisma = new PrismaClient()


module.exports = function (passport: PassportStatic) {
    passport.serializeUser<User, any>((user: User, done: any) => {
        console.log("Serialize", user)
        if (user) {
            done(null, user.email);
        }
    });

    passport.deserializeUser(async (email: string, done) => {
        console.log("Deserial", email)
        try {
            const instance = await prisma.user.findUnique({
                where: {
                    email
                }
            });
            if (!instance) {
                throw Error("username doesn't exist")
            }
            done(null, instance);
        } catch (err) {
            done(err, false);
        }
    });


    passport.use(new LocalStrategy(async (email, password, done) => {
        try {
            console.log(email, password)
            const instance = await prisma.user.findUnique({
                where: {
                    email
                }
            });

            if (!instance) {
                throw Error("email doesn't exist")
            }
            const isPassSame = await bcrypt.compare(
                password,
                instance.hashed_password
            )
            if (!isPassSame) {
                throw Error('Incorrect Password');
            }
            // successful auth
            done(undefined, instance)
        } catch (err) {
            return done(undefined, false, { message: err.message })
        }
    }));
}
