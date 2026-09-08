import dotenv from 'dotenv';
import { defineConfig } from "prisma/config";

const environment = process.env.NODE_ENV ?? 'development';

dotenv.config({ path: `.env.${environment}` });
dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
