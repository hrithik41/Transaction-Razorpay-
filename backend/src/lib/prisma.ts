// import "dotenv/config";
// import { PrismaMariaDb } from "@prisma/adapter-mariadb";
// import { PrismaClient } from "@prisma/client";

// const adapter = new PrismaMariaDb({
//     host: process.env.DATABASE_HOST,
//     user: process.env.DATABASE_USER,
//     password: process.env.DATABASE_PASSWORD,
//     database: process.env.DATABASE_NAME,
// });

// const prisma = new PrismaClient({ adapter });

// export default prisma;


import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set!");
}

const dbUrl = new URL(process.env.DATABASE_URL);

const adapter = new PrismaMariaDb({
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port) || 27136, 
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.substring(1), // remove the leading slash
    connectionLimit: 5,
    connectTimeout: 30000,
    ssl: { rejectUnauthorized: false }
} as any); // Cast to any to bypass strict typing if it complains about ssl

const prisma = new PrismaClient({ adapter });

export default prisma;
