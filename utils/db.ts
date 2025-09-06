import { Client } from "@db/postgres";

const DB_CONNECTION_STRING = Deno.env.get("DATABASE_URL") ?? "";

export type GameContent = {
  Id: string;
  Name: string;
  Tags: { Id: string; Name: string }[];
  Added: string;
  Links: { Url: string; Name: string }[];
  GameId: string;
  Genres: { Id: string; Name: string }[];
  Source: { Id: string; Name: string };
  Features: { Id: string; Name: string }[];
  Modified: string;
  PluginId: string;
  Platforms: { Id: string; Name: string; SpecificationId: string }[];
  AgeRatings: { Id: string; Name: string }[];
  Developers: { Id: string; Name: string }[];
  Publishers: { Id: string; Name: string }[];
  Description: string;
  ReleaseDate: string;
  HasCoverImage: boolean;
  CommunityScore: number;
  CompletionStatus: { Id: string; Name: string };
  HasBackgroundImage: boolean;
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
    const result = await client.queryObject<Game>("SELECT id, name, contents FROM playnite_game ORDER BY name");
    return result.rows;
  } finally {
    await client.end();
  }
}
