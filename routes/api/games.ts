import { Handlers } from "$fresh/server.ts";
import { getGamesFromDB } from "../../utils/db.ts";

export const handler: Handlers = {
  GET: async (_req, _ctx) => {
    const games = await getGamesFromDB();
    return new Response(JSON.stringify(games), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
};


