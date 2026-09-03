import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const schema = {}

//you can manually paste the databaseurl here if it is failing
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URI is required for API routes.");
}

const sql = neon(databaseUrl);

export const db = drizzle({ client: sql, schema})