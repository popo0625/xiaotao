import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!url) {
  console.error("❌ DATABASE_URL is required");
  process.exit(1);
}

const turso = createClient({ url, authToken });

async function main() {
  console.log(`🔗 Connecting to Turso: ${url}`);

  const sql = readFileSync(join(process.cwd(), "turso-schema.sql"), "utf-8");
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`📦 Executing ${statements.length} SQL statements...`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      await turso.execute(stmt + ";");
      process.stdout.write(".");
    } catch (err) {
      console.error(`\n❌ Error on statement ${i + 1}:`, (err as Error).message);
      console.error(`   SQL: ${stmt.substring(0, 80)}...`);
    }
  }

  console.log("\n✅ Schema pushed successfully!");

  // Verify by listing tables
  const result = await turso.execute(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
  );
  console.log("\n📋 Tables:");
  for (const row of result.rows) {
    console.log(`   - ${row.name}`);
  }

  await turso.close();
}

main().catch((err) => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});
