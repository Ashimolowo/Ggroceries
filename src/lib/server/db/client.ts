import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const schema = {}

const databaseUrl = "postgresql://neondb_owner:npg_begLPHQw3M1T@ep-raspy-wind-ae9jbfn9-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

if (!databaseUrl) {
    throw new Error("DATABASE_URI is required for API routes.");
}

const sql = neon(databaseUrl);

export const db = drizzle({ client: sql, schema})