const { readFileSync } = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const sql = readFileSync(
    path.join(__dirname, "../prisma/sql/import_report_xnt.sql"),
    "utf-8"
  );

  await prisma.$executeRawUnsafe(sql);
  console.log("✅ Function created or updated.");
}

main()
  .catch((err) => {
    console.error("❌ Failed to execute function:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
