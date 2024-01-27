export default function Search({
    query,
    setQuery,
}: {
    query: string;
    setQuery(s: string): void;
}) {
    return (
        <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
    );
}
