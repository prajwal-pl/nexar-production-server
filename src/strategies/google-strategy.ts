import { Strategy } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";
import passport from "passport";

const prisma = new PrismaClient();

passport.serializeUser((user: any, done: any) => {
  console.log("Serializing user");
  done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
  console.log("Deserializing user");
  done(null, user as Express.User);
});

passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:8000/auth/callback/google",
      passReqToCallback: true,
    },
    async (
      req: any,
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      console.log("Google strategy callback executed");
      try {
        const user = await prisma.user.findUnique({
          where: {
            cognitoId: profile.id,
          },
        });
        if (user) {
          return done(null, user);
        }
        const newUser = await prisma.user.create({
          data: {
            cognitoId: profile.id,
            username: profile.displayName,
            profilePictureUrl: profile.photos[0].value,
          },
        });

        return done(null, newUser);
      } catch (error: any) {
        return done(error, null);
      }
    }
  )
);
