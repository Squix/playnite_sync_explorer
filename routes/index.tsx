import { Handlers, PageProps } from "$fresh/server.ts";
import { Game, getGamesFromDB } from "../utils/db.ts";

import {
  BookOpen,
  Brain,
  Car,
  Gamepad,
  Heart,
  Joystick,
  ListTodo,
  HandFist,
  LayoutPanelTop,
  Mountain,
  Music,
  Puzzle,
  Search,
  Spade,
  Shield,
  Sword,
  Sparkles,
  Target,
  MessageCircleQuestionMark,
  Volleyball,
  LucideIcon
} from "lucide-preact";

interface Data {
  games: Game[];
  query: string;
}

const genreColorMap: Record<string, string> = {
  "Adventure": "bg-green-600 text-green-100",
  "Arcade": "bg-yellow-600 text-yellow-100",
  "Card & Board Game": "bg-teal-700 text-teal-100",
  "Fighting": "bg-red-700 text-red-100",
  "Hack and slash/Beat 'em up": "bg-pink-700 text-pink-100",
  "Indie": "bg-blue-600 text-blue-100",
  "MOBA": "bg-purple-700 text-purple-100",
  "Music": "bg-indigo-600 text-indigo-100",
  "Platform": "bg-cyan-700 text-cyan-100",
  "Point-and-click": "bg-rose-700 text-rose-100",
  "Puzzle": "bg-orange-700 text-orange-100",
  "Quiz/Trivia": "bg-lime-700 text-lime-100",
  "Racing": "bg-fuchsia-700 text-fuchsia-100",
  "Real Time Strategy (RTS)": "bg-emerald-700 text-emerald-100",
  "Role-playing (RPG)": "bg-violet-700 text-violet-100",
  "Shooter": "bg-sky-700 text-sky-100",
  "Simulator": "bg-stone-700 text-stone-100",
  "Sport": "bg-amber-800 text-amber-100",
  "Strategy": "bg-blue-800 text-blue-100",
  "Tactical": "bg-pink-900 text-pink-100",
  "Turn-based strategy (TBS)": "bg-neutral-700 text-neutral-100",
  "Visual Novel": "bg-green-900 text-green-100",
};
const defaultGenreColor = "bg-orange-700 text-orange-100";

const genreIconMap: Record<string, LucideIcon> = {
  "Adventure": Mountain,
  "Arcade": Gamepad,
  "Card & Board Game": Spade,
  "Fighting": HandFist,
  "Hack and slash/Beat 'em up": Sword,
  "Indie": Sparkles,
  "MOBA": Shield,
  "Music": Music,
  "Platform": LayoutPanelTop,
  "Point-and-click": Search,
  "Puzzle": Puzzle,
  "Quiz/Trivia": MessageCircleQuestionMark,
  "Racing": Car,
  "Real Time Strategy (RTS)": Brain,
  "Role-playing (RPG)": BookOpen,
  "Shooter": Target,
  "Simulator": Joystick,
  "Sport": Volleyball,
  "Strategy": Brain,
  "Tactical": Shield,
  "Turn-based strategy (TBS)": Brain,
  "Visual Novel": BookOpen,
};

const storeColorMap: Record<string, string> = {
  "Epic": "bg-fuchsia-700 text-fuchsia-100",
  "GOG": "bg-purple-800 text-purple-100",
  "itch.io": "bg-pink-700 text-pink-100",
  "Oculus": "bg-cyan-800 text-cyan-100",
  "Steam": "bg-blue-700 text-blue-100",
  "Ubisoft Connect": "bg-yellow-700 text-yellow-100",
};
const defaultStoreColor = "bg-gray-600 text-gray-100";

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
                      {g.contents.Genres?.map((genre: any) => {
                        const Icon = genreIconMap[genre.Name];
                        return (
                          <span class="group relative mr-2" key={genre.Id}>
                            {Icon
                              ? (
                                <Icon
                                  size={20}
                                  class="inline align-middle"
                                />
                              )
                              : (
                                <Gamepad
                                  size={20}
                                  class="inline align-middle opacity-50"
                                />
                              )}
                            <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block pointer-events-none z-10 bg-gray-800 text-gray-100 text-xs rounded px-2 py-1 shadow">
                              {genre.Name}
                            </span>
                          </span>
                        );
                      })}
                    </td>
                    <td class="border border-gray-700 px-4 py-2 w-32">
                      {g.contents.Source?.Name && (
                        <span
                          class={`inline-block whitespace-nowrap overflow-hidden text-ellipsis max-w-[7rem] rounded-full px-2 py-1 mr-1 text-xs font-semibold leading-none h-6 ${
                            storeColorMap[g.contents.Source.Name] ||
                            defaultStoreColor
                          }`}
                        >
                          {g.contents.Source.Name}
                        </span>
                      )}
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
