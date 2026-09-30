import session from "express-session"; import connectPgSimple from "connect-pg-simple";
const PgStore = connectPgSimple(session);
export const sessionMiddleware = session({ store: new PgStore({ conString: process.env.DATABASE_URL, createTableIfMissing: true }), name: "institute.sid", secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, cookie: { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 1000 * 60 * 60 * 8 } });

