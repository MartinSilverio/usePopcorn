import { WatchedMovie } from '../typesAndConstants/types';
import WatchedMovieItem from './WatchedMovieItem';

export default function WatchedMovieList({
    watched,
    onDeleteWatched,
}: {
    watched: WatchedMovie[];
    onDeleteWatched(s: string): void;
}) {
    return (
        <ul className="list">
            {watched.map((movie) => (
                <WatchedMovieItem
                    movie={movie}
                    key={movie.imdbID}
                    onDeleteWatched={onDeleteWatched}
                />
            ))}
        </ul>
    );
}
