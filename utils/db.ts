import { Client } from "@db/postgres";

const DB_CONNECTION_STRING = Deno.env.get("DATABASE_URL") ?? "";

const client = new Client(DB_CONNECTION_STRING);

export async function getGamesFromDB() {
  await client.connect();
  try {
    const result = await client.queryObject<{
      id: number;
      name: string;
      contents: Record<string,string>;
    }>("SELECT id, name, contents FROM playnite_game");
    return result.rows;
  } finally {
    await client.end();
  }
}
