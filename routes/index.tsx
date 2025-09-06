import { Handlers, PageProps } from "$fresh/server.ts";
import { getGamesFromDB } from "../utils/db.ts";

type Game = { id: number; name: string; contents: Record<string, any> };

interface Data {
  games: Game[];
  query: string;
}

export const handler: Handlers<Data> = {
  GET: async (req, ctx) => {
    const url = new URL(req.url);
    const query = url.searchParams.get("q") ?? "";
    let games: Game[] = [];
    try {
      games = await getGamesFromDB();
      console.log(games[0]);
    } catch (error) {
      console.log(error);
      // fall back to sample data if DB is not reachable
      games = [
        { id: 1, name: "Apex Legends", contents: "Battle Royale" },
        { id: 2, name: "Stardew Valley", contents: "Simulation" },
        { id: 3, name: "Hades", contents: "Roguelike" },
      ].filter((g) => g.name.toLowerCase().includes(query.toLowerCase()));
    }
    return ctx.render({ games, query });
  },
};

export default function Home({ data }: PageProps<Data>) {
  const { games, query } = data;
  return (
    <div class="p-12 w-max-2xl">
      <h1 class="text-2xl font-bold mb-4">Games</h1>
      <form method="get" action="/" class="mb-4">
        <input
          name="q"
          value={query}
          placeholder="Search..."
          class="border px-2 py-1"
        />
        <button type="submit" class="ml-2 px-3 py-1 border rounded">
          Search
        </button>
      </form>
      <table class="min-w-full bg-white shadow rounded">
        <thead>
          <tr class="text-left">
            <th class="border px-4 py-2 w-8">ID</th>
            <th class="border px-4 py-2 w-12">Name</th>
            <th class="border px-4 py-2 w-1/6">Genres</th>
          </tr>
        </thead>
        <tbody>
          {games.map((g) => (
            <tr key={g.id}>
              <td class="border px-4 py-2">{g.id}</td>
              <td class="border px-4 py-2">{g.name}</td>
              <td class="border px-2 py-2 w-32">
                {g.contents.Genres?.map((g: any) => g.Name).join(" | ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
