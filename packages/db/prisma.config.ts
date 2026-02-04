// Prisma configuration file
// This file is optional - Prisma works fine with just schema.prisma
// Use this file if you need custom migration paths or advanced configuration

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});

