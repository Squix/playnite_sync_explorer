import { Handlers, PageProps } from "$fresh/server.ts";
import { Game, getGamesFromDB } from "../utils/db.ts";

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
      if (query) {
        games = games.filter((g) => {
          const nameMatch = g.name.toLowerCase().includes(query.toLowerCase());
          const genres = Array.isArray(g.contents.Genres)
            ? g.contents.Genres.map((genre: any) => genre.Name).join(" | ")
            : "";
          const genreMatch = genres.toLowerCase().includes(query.toLowerCase());
          return nameMatch || genreMatch;
        });
      }
    } catch (error) {
      throw error;
    }
    return ctx.render({ games, query });
  },
};

export default function Home({ data }: PageProps<Data>) {
  const { games, query } = data;
  return (
    <div class="bg-gray-900 text-gray-100 min-h-screen w-full">
      <div class="p-8 max-w-3xl mx-auto">
        <h1 class="text-2xl font-bold mb-4">Games</h1>
        <form method="get" action="/" class="mb-4 flex gap-2 items-center">
          <input
            name="q"
            value={query}
            placeholder="Search..."
            class="border px-2 py-1"
          />
          <button type="submit" class="px-3 py-1 border rounded">
            Search
          </button>
          {query && (
            <a
              href="/"
              class="px-3 py-1 border rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
            >
              Clear
            </a>
          )}
        </form>
        <table class="min-w-full bg-gray-800 shadow rounded text-gray-100">
          <thead>
            <tr class="text-left">
              <th class="border border-gray-700 px-4 py-2 w-12">Name</th>
              <th class="border border-gray-700 px-4 py-2 w-64">Genres</th>
              <th class="border border-gray-700 px-4 py-2 w-32">Stores</th>
            </tr>
          </thead>
          <tbody>
            {games.length === 0
              ? (
                <tr>
                  <td
                    class="border border-gray-700 px-4 py-4 text-center text-gray-400"
                    colSpan={3}
                  >
                    no games found :(
                  </td>
                </tr>
              )
              : (
                games.map((g) => (
                  <tr key={g.id} class="even:bg-gray-700">
                    <td class="border border-gray-700 px-4 py-2 w-64">
                      {g.name}
                    </td>
                    <td class="border border-gray-700 px-4 py-2 w-64">
                      {g.contents.Genres?.map((genre: any) => genre.Name).join(
                        " | ",
                      )}
                    </td>
                    <td class="border border-gray-700 px-4 py-2 w-32">
                      {g.contents.Source?.Name}
                    </td>
                  </tr>
                ))
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
