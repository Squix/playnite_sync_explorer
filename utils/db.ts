import { Client } from "@db/postgres";

const DB_CONNECTION_STRING = Deno.env.get("DATABASE_URL") ?? "";

export async function getGamesFromDB() {
  const client = new Client(DB_CONNECTION_STRING);
  try {
    await client.connect();
  } catch (err) {
    throw new Error("Database connection failed: " + (err?.message || err));
  }
  try {
    const result = await client.queryObject<{
      id: number;
      name: string;
      contents: Record<string, string>;
    }>("SELECT id, name, contents FROM playnite_game ORDER BY name");
    return result.rows;
  } finally {
    await client.end();
  }
}
