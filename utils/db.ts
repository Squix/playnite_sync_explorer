import { Client } from "@db/postgres";

const DB_CONNECTION_STRING = Deno.env.get("DATABASE_URL") ?? "";

export type GameContent = {
  id: string;
  name: string;
  tags: { id: string; name: string }[];
  added: string;
  links: { url: string; name: string }[];
  gameId: string;
  genres: { id: string; name: string }[];
  source: { id: string; name: string };
  features: { id: string; name: string }[];
  modified: string;
  pluginId: string;
  platforms: { id: string; name: string; specificationId: string }[];
  ageRatings: { id: string; name: string }[];
  developers: { id: string; name: string }[];
  publishers: { id: string; name: string }[];
  description: string;
  releaseDate: string;
  hasCoverImage: boolean;
  communityScore: number;
  completionStatus: { id: string; name: string };
  hasBackgroundImage: boolean;
};

export type Game = { id: number; name: string; contents: GameContent };

export async function getGamesFromDB() {
  const client = new Client(DB_CONNECTION_STRING);
  try {
    await client.connect();
  } catch (err) {
    throw new Error("Database connection failed: " + (err?.message || err));
  }
  try {
    const result = await client.queryObject<Game>(
      "SELECT id, name, contents FROM playnite_game ORDER BY name",
    );
    return result.rows;
  } finally {
    await client.end();
  }
}
