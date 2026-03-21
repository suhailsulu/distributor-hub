import { SessionOptions } from "iron-session";

export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_PASSWORD as string,
    cookieName: "distributor_hub_session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};

export interface SessionData {
    userId: number;
    email: string;
    isLoggedIn: boolean;
    role: "user" | "admin";
}